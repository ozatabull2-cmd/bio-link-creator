import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

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

// API Endpoint: Save profile data to profile.json
app.post('/api/save-profile', (req, res) => {
  try {
    const profileData = req.body;
    const profilePath = path.resolve(__dirname, 'src', 'profile.json');
    fs.writeFileSync(profilePath, JSON.stringify(profileData, null, 2), 'utf-8');
    return res.json({ success: true });
  } catch (err: any) {
    console.error('Save Profile Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to save profile data.' });
  }
});

// API Endpoint: Track click for a link in profile.json
app.post('/api/track-click/:id', (req, res) => {
  try {
    const linkId = req.params.id;
    const profilePath = path.resolve(__dirname, 'src', 'profile.json');
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
