import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import os from 'os';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Initialize Gemini Client Lazily/Safely as recommended
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing. Please add it via the Settings > Secrets panel.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Endpoint: Optimize/Rewrite biography
app.post('/api/generate-bio', async (req, res) => {
  try {
    const { title, currentBio, tone } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Profile title is required.' });
    }

    const ai = getGeminiClient();

    const prompt = `You are an elite copywriter and digital creator strategist. Your goal is to write a highly engaging, catchy, and converting social media bio (under 120 characters) for a bio-link page (like Linktree).
Profile Name/Title: "${title}"
Current Bio text: "${currentBio || ''}"
Requested Tone/Vibe: "${tone || 'Playful and Catchy'}"

Guidelines:
- Keep it concise (strictly 60-120 characters).
- Include 1-2 relevant emojis to add warmth and flair.
- Make it punchy and call-to-action oriented.
- Return ONLY the final polished bio text without any introductory remarks, quotes, or conversational explanations.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    const result = response.text?.trim() || '';
    return res.json({ success: true, bio: result });
  } catch (err: any) {
    console.error('Bio Gen Error:', err);
    return res.status(500).json({
      error: err.message || 'An error occurred during bio generation.',
      needsConfig: !process.env.GEMINI_API_KEY,
    });
  }
});

// API Endpoint: Suggest/Brainstorm highly converting Link ideas
app.post('/api/suggest-links', async (req, res) => {
  try {
    const { title, description, niche } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Profile title is required to suggest links.' });
    }

    const ai = getGeminiClient();

    const prompt = `You are an expert digital marketing growth hacker. Brainstorm exactly 3 highly relevant and creative links that this creator/business should feature on their Linktree/Bio-link page to maximize engagement, sales, or lead capture.
Profile Name: "${title}"
Niche/Category: "${niche || 'Digital Creator'}"
Description: "${description || 'A bio-link page'}"

Provide your response strictly matching the required JSON schema, containing a list of 3 objects, each with:
- 'title': A short, punchy, high-impact link title (e.g., '🎁 Claim Free Guide', '💬 Direct Support WhatsApp', '🔥 Shop Hot Releases')
- 'subtitle': A brief, enticing subtitle (e.g., 'Get 5 templates instantly', 'Message us 24/7', '20% off ends tonight')
- 'url': A logical mock URL matching the concept
- 'iconType': One of 'web', 'whatsapp', 'instagram', 'youtube', 'store', 'tiktok', 'twitter', 'discord', 'telegram'
- 'colorTheme': Suggested card vibe color (one of 'blue', 'emerald', 'amber', 'rose', 'violet', 'indigo')`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'A list of 3 recommended link cards',
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              url: { type: Type.STRING },
              iconType: { type: Type.STRING },
              colorTheme: { type: Type.STRING },
            },
            required: ['title', 'subtitle', 'url', 'iconType', 'colorTheme'],
          },
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Received an empty response from Gemini.');
    }

    const suggestedLinks = JSON.parse(text);
    return res.json({ success: true, suggestedLinks });
  } catch (err: any) {
    console.error('Suggest Links Error:', err);
    return res.status(500).json({
      error: err.message || 'An error occurred during link suggestion.',
      needsConfig: !process.env.GEMINI_API_KEY,
    });
  }
});

// API Endpoint: Context-grounded chat companion for Linktree Optimization
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, profileData } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages history array is required.' });
    }

    const ai = getGeminiClient();

    // Prepare ground context
    const currentLinks = (profileData?.links || [])
      .map((link: any) => `- [${link.title}]: ${link.subtitle} (${link.url}) [Clicks: ${link.clicks || 0}]`)
      .join('\n');

    const systemInstruction = `You are a growth marketing and creator branding copilot inside "Bio-Link Creator & AI Optimizer".
You have real-time visibility over the user's active bio-link profile:
1. Title: "${profileData?.title || 'Untitled Profile'}"
2. Bio / Description: "${profileData?.bio || 'No bio entered'}"
3. Active Bio Theme: "${profileData?.theme || 'Default'}"
4. Active Links List:
${currentLinks || '(No links added yet)'}

Help the user write better link hooks, suggest monetization strategies, brainstorm lead magnets, optimize their social layout, or general advice on boosting click-through rates. Keep your replies actionable, concise, formatted with clear markdown, and warm. Give actual text recommendations when suggested.`;

    const chatHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const latestMessage = messages[messages.length - 1]?.content || '';

    const chat = ai.chats.create({
      model: 'gemini-3.5-flash',
      config: {
        systemInstruction,
      },
      history: chatHistory,
    });

    const response = await chat.sendMessage({
      message: latestMessage,
    });

    return res.json({ success: true, reply: response.text });
  } catch (err: any) {
    console.error('Chat Error:', err);
    return res.status(500).json({
      error: err.message || 'An error occurred during chat.',
      needsConfig: !process.env.GEMINI_API_KEY,
    });
  }
});

const profilesDir = path.resolve(__dirname, 'public', 'profiles');

function ensureProfilesSetup() {
  if (!fs.existsSync(profilesDir)) {
    fs.mkdirSync(profilesDir, { recursive: true });
  }
  const registryPath = path.join(profilesDir, 'registry.json');
  if (!fs.existsSync(registryPath)) {
    const defaultRegistry = [
      { id: 'ankara-cocuk-rehberi', title: 'Ankara Çocuk Rehberi' }
    ];
    fs.writeFileSync(registryPath, JSON.stringify(defaultRegistry, null, 2), 'utf-8');
  }
  const defaultProfilePath = path.join(profilesDir, 'ankara-cocuk-rehberi.json');
  if (!fs.existsSync(defaultProfilePath)) {
    const srcProfilePath = path.resolve(__dirname, 'src', 'profile.json');
    if (fs.existsSync(srcProfilePath)) {
      fs.copyFileSync(srcProfilePath, defaultProfilePath);
    } else {
      const minimalProfile = {
        profileTitle: "Ankara Çocuk Rehberi",
        profileBio: "Ankara'daki en güncel çocuk etkinlikleri, atölyeler ve aile rehberi burada! ✨",
        selectedAvatar: "🧒",
        selectedAvatarBg: "from-amber-200 to-orange-400",
        avatarType: "emoji",
        avatarUrl: "",
        activeThemeId: "slate_light",
        links: [],
        socials: { instagram: "", whatsapp: "", youtube: "", twitter: "" }
      };
      fs.writeFileSync(defaultProfilePath, JSON.stringify(minimalProfile, null, 2), 'utf-8');
    }
  }
}

// GET /api/server-info - get server local IP addresses
app.get('/api/server-info', (req, res) => {
  try {
    const nets = os.networkInterfaces();
    const results: string[] = [];
    
    for (const name of Object.keys(nets)) {
      for (const net of nets[name] || []) {
        if (net.family === 'IPv4' && !net.internal) {
          results.push(net.address);
        }
      }
    }
    
    return res.json({
      success: true,
      localIps: results,
      port: 3000
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to retrieve server info.' });
  }
});

// GET /api/profiles - list all profiles
app.get('/api/profiles', (req, res) => {
  try {
    ensureProfilesSetup();
    const registryPath = path.join(profilesDir, 'registry.json');
    const data = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
    return res.json({ success: true, profiles: data });
  } catch (err: any) {
    console.error('Get Profiles Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to list profiles.' });
  }
});

// GET /api/profile/:id - get specific profile details
app.get('/api/profile/:id', (req, res) => {
  try {
    ensureProfilesSetup();
    const profileId = req.params.id;
    const profilePath = path.join(profilesDir, `${profileId}.json`);
    if (!fs.existsSync(profilePath)) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    const data = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
    return res.json({ success: true, profile: data });
  } catch (err: any) {
    console.error('Get Profile Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to load profile.' });
  }
});

// POST /api/save-profile/:id - save specific profile details
app.post('/api/save-profile/:id', (req, res) => {
  try {
    ensureProfilesSetup();
    const profileId = req.params.id;
    const profileData = req.body;
    const profilePath = path.join(profilesDir, `${profileId}.json`);
    
    // Merge to preserve views and link click counts tracked on the server
    let mergedData = { ...profileData };
    if (fs.existsSync(profilePath)) {
      const existingData = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
      mergedData.views = existingData.views || 0;
      
      // Preserve clicks for each link
      const newLinks = (profileData.links || []).map((lnk: any) => {
        const existingLnk = (existingData.links || []).find((l: any) => l.id === lnk.id);
        return {
          ...lnk,
          clicks: existingLnk ? (existingLnk.clicks || 0) : (lnk.clicks || 0)
        };
      });
      mergedData.links = newLinks;
    }
    
    fs.writeFileSync(profilePath, JSON.stringify(mergedData, null, 2), 'utf-8');
    
    const registryPath = path.join(profilesDir, 'registry.json');
    let registry = [];
    if (fs.existsSync(registryPath)) {
      registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
    }
    
    const exists = registry.some((p: any) => p.id === profileId);
    if (!exists) {
      registry.push({
        id: profileId,
        title: profileData.profileTitle || profileId
      });
      fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
    } else {
      registry = registry.map((p: any) => {
        if (p.id === profileId) {
          return { ...p, title: profileData.profileTitle || p.title };
        }
        return p;
      });
      fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
    }
    
    return res.json({ success: true, profile: mergedData });
  } catch (err: any) {
    console.error('Save Profile Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to save profile.' });
  }
});

// POST /api/save-profile - legacy save endpoint
app.post('/api/save-profile', (req, res) => {
  try {
    ensureProfilesSetup();
    const profileData = req.body;
    const profilePath = path.join(profilesDir, 'ankara-cocuk-rehberi.json');
    fs.writeFileSync(profilePath, JSON.stringify(profileData, null, 2), 'utf-8');
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to save profile.' });
  }
});

// POST /api/create-profile - create new profile
app.post('/api/create-profile', (req, res) => {
  try {
    ensureProfilesSetup();
    const { id, title, cloneFrom } = req.body;
    console.log('[DEBUG] Create Profile Request received:', { id, title, cloneFrom });
    if (!id || !title) {
      return res.status(400).json({ error: 'Profile ID and Title are required.' });
    }
    const profilePath = path.join(profilesDir, `${id}.json`);
    if (fs.existsSync(profilePath)) {
      return res.status(400).json({ error: 'Profile already exists.' });
    }
    
    let newProfile: any = null;
    
    if (cloneFrom) {
      const sourcePath = path.join(profilesDir, `${cloneFrom}.json`);
      console.log('[DEBUG] Attempting to clone from:', sourcePath);
      if (fs.existsSync(sourcePath)) {
        console.log('[DEBUG] Source file found. Cloning...');
        const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
        newProfile = {
          ...sourceData,
          profileTitle: title // Override display title
        };
      }
    }
    
    if (!newProfile) {
      newProfile = {
        profileTitle: title,
        profileBio: `✨ Yeni ${title} biyografisi buraya!`,
        selectedAvatar: "👤",
        selectedAvatarBg: "from-blue-200 to-indigo-400",
        avatarType: "emoji",
        avatarUrl: "",
        activeThemeId: "slate_light",
        links: [],
        socials: { instagram: "", whatsapp: "", youtube: "", twitter: "" }
      };
    }
    
    fs.writeFileSync(profilePath, JSON.stringify(newProfile, null, 2), 'utf-8');
    
    const registryPath = path.join(profilesDir, 'registry.json');
    let registry = [];
    if (fs.existsSync(registryPath)) {
      registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
    }
    registry.push({ id, title });
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
    
    return res.json({ success: true, profile: newProfile });
  } catch (err: any) {
    console.error('Create Profile Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to create profile.' });
  }
});

// DELETE /api/profile/:id - delete a profile
app.delete('/api/profile/:id', (req, res) => {
  try {
    ensureProfilesSetup();
    const profileId = req.params.id;
    if (profileId === 'ankara-cocuk-rehberi') {
      return res.status(400).json({ error: 'Cannot delete the default profile.' });
    }
    const profilePath = path.join(profilesDir, `${profileId}.json`);
    if (fs.existsSync(profilePath)) {
      fs.unlinkSync(profilePath);
    }
    
    const registryPath = path.join(profilesDir, 'registry.json');
    if (fs.existsSync(registryPath)) {
      let registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
      registry = registry.filter((p: any) => p.id !== profileId);
      fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
    }
    
    return res.json({ success: true });
  } catch (err: any) {
    console.error('Delete Profile Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to delete profile.' });
  }
});

// POST /api/lead/:id - record parent lead submission
app.post('/api/lead/:id', (req, res) => {
  try {
    ensureProfilesSetup();
    const profileId = req.params.id;
    const { parentName, phone, childAgeOrGrade, programInterest, note } = req.body;
    if (!parentName || !phone) {
      return res.status(400).json({ error: 'Parent name and phone are required.' });
    }

    const profilePath = path.join(profilesDir, `${profileId}.json`);
    let profileData: any = {};
    if (fs.existsSync(profilePath)) {
      profileData = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
    }

    const newLead = {
      id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      parentName,
      phone,
      childAgeOrGrade: childAgeOrGrade || '',
      programInterest: programInterest || 'Genel Bilgi',
      note: note || '',
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    if (!Array.isArray(profileData.leads)) {
      profileData.leads = [];
    }
    profileData.leads.unshift(newLead);

    fs.writeFileSync(profilePath, JSON.stringify(profileData, null, 2), 'utf-8');
    return res.json({ success: true, lead: newLead, totalLeads: profileData.leads.length });
  } catch (err: any) {
    console.error('Record Lead Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to record lead.' });
  }
});

// POST /api/rename-profile/:id - rename profile ID and title
app.post('/api/rename-profile/:id', (req, res) => {
  try {
    ensureProfilesSetup();
    const oldId = req.params.id;
    const { newId, newTitle } = req.body;
    if (!newId || !newTitle) {
      return res.status(400).json({ error: 'New ID and Title are required.' });
    }
    
    const registryPath = path.join(profilesDir, 'registry.json');
    let registry = [];
    if (fs.existsSync(registryPath)) {
      registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
    }
    
    if (oldId !== newId && registry.some((p: any) => p.id === newId)) {
      return res.status(400).json({ error: 'This profile ID already exists.' });
    }
    
    const oldProfilePath = path.join(profilesDir, `${oldId}.json`);
    const newProfilePath = path.join(profilesDir, `${newId}.json`);
    
    let profileData: any = {};
    if (fs.existsSync(oldProfilePath)) {
      profileData = JSON.parse(fs.readFileSync(oldProfilePath, 'utf-8'));
      profileData.profileTitle = newTitle;
      
      fs.writeFileSync(newProfilePath, JSON.stringify(profileData, null, 2), 'utf-8');
      
      if (oldId !== newId) {
        fs.unlinkSync(oldProfilePath);
      }
    } else {
      const newProfile = {
        profileTitle: newTitle,
        profileBio: `✨ Yeni ${newTitle} biyografisi buraya!`,
        selectedAvatar: "👤",
        selectedAvatarBg: "from-blue-200 to-indigo-400",
        avatarType: "emoji",
        avatarUrl: "",
        activeThemeId: "slate_light",
        links: [],
        socials: { instagram: "", whatsapp: "", youtube: "", twitter: "" }
      };
      fs.writeFileSync(newProfilePath, JSON.stringify(newProfile, null, 2), 'utf-8');
    }
    
    registry = registry.map((p: any) => {
      if (p.id === oldId) {
        return { id: newId, title: newTitle };
      }
      return p;
    });
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
    
    return res.json({ success: true });
  } catch (err: any) {
    console.error('Rename Profile Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to rename profile.' });
  }
});


// POST /api/track-click/:profileId/:linkId - Track click for a link in specific profile
app.post('/api/track-click/:profileId/:linkId', (req, res) => {
  try {
    ensureProfilesSetup();
    const { profileId, linkId } = req.params;
    const profilePath = path.join(profilesDir, `${profileId}.json`);
    if (fs.existsSync(profilePath)) {
      const data = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
      data.links = data.links.map((lnk: any) => {
        if (lnk.id === linkId) {
          return { ...lnk, clicks: (lnk.clicks || 0) + 1 };
        }
        return lnk;
      });
      fs.writeFileSync(profilePath, JSON.stringify(data, null, 2), 'utf-8');
      return res.json({ success: true });
    } else {
      return res.status(404).json({ error: 'Profile not found' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to track click' });
  }
});

// POST /api/track-view/:profileId - Increment profile page view count
app.post('/api/track-view/:profileId', (req, res) => {
  try {
    ensureProfilesSetup();
    const { profileId } = req.params;
    const profilePath = path.join(profilesDir, `${profileId}.json`);
    if (fs.existsSync(profilePath)) {
      const data = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
      data.views = (data.views || 0) + 1;
      fs.writeFileSync(profilePath, JSON.stringify(data, null, 2), 'utf-8');
      return res.json({ success: true, views: data.views });
    } else {
      return res.status(404).json({ error: 'Profile not found' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to track view' });
  }
});

// POST /api/reset-stats/:profileId - Reset views and click counts for a profile
app.post('/api/reset-stats/:profileId', (req, res) => {
  try {
    ensureProfilesSetup();
    const { profileId } = req.params;
    const profilePath = path.join(profilesDir, `${profileId}.json`);
    if (fs.existsSync(profilePath)) {
      const data = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
      data.views = 0;
      data.links = (data.links || []).map((lnk: any) => ({ ...lnk, clicks: 0 }));
      fs.writeFileSync(profilePath, JSON.stringify(data, null, 2), 'utf-8');
      return res.json({ success: true, profile: data });
    } else {
      return res.status(404).json({ error: 'Profile not found' });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to reset stats' });
  }
});


// POST /api/track-click/:id - legacy click tracker
app.post('/api/track-click/:id', (req, res) => {
  try {
    ensureProfilesSetup();
    const linkId = req.params.id;
    const profilePath = path.join(profilesDir, 'ankara-cocuk-rehberi.json');
    if (fs.existsSync(profilePath)) {
      const data = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
      data.links = data.links.map((lnk: any) => {
        if (lnk.id === linkId) {
          return { ...lnk, clicks: (lnk.clicks || 0) + 1 };
        }
        return lnk;
      });
      fs.writeFileSync(profilePath, JSON.stringify(data, null, 2), 'utf-8');
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to track click' });
  }
});

// Configure Vite middleware in development or serve static assets in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = 3000;

  if (isProd) {
    // Serve production assets
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    } else {
      console.warn('Production build directory "dist" not found. Falling back to development setup.');
    }
  } else {
    // Mount Vite Dev Server in middleware mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Bio-Link Creator & AI Optimizer server online at http://localhost:${port}`);
  });
}

startServer();
