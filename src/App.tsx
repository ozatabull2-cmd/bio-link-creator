import React, { useState, useEffect } from 'react';
import defaultProfile from './profile.json';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Wand2,
  Plus,
  Trash2,
  Send,
  RefreshCw,
  Copy,
  PlusCircle,
  Check,
  AlertCircle,
  X,
  Edit3,
  Link as LinkIcon,
  Globe,
  MessageCircle,
  Instagram,
  Youtube,
  ShoppingBag,
  Music,
  Twitter,
  Hash,
  Share2,
  Settings,
  Palette,
  Eye,
  MousePointerClick,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

// Interfaces for our state
interface LinkItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  iconType: 'web' | 'whatsapp' | 'instagram' | 'youtube' | 'store' | 'tiktok' | 'twitter' | 'discord' | 'telegram';
  colorTheme: 'blue' | 'emerald' | 'amber' | 'rose' | 'violet' | 'indigo' | 'slate';
  clicks: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Design theme presets
interface ThemePreset {
  id: string;
  name: string;
  bgClass: string;
  cardBgClass: string;
  textClass: string;
  subtitleClass: string;
  phoneBgClass: string;
  phoneCardBgClass: string;
  accentClass: string;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'slate_light',
    name: 'Sleek Slate (Açık)',
    bgClass: 'bg-[#F8FAFC]',
    cardBgClass: 'bg-white border-slate-200/60',
    textClass: 'text-slate-800',
    subtitleClass: 'text-slate-500',
    phoneBgClass: 'from-orange-50 via-white to-sky-50',
    phoneCardBgClass: 'bg-white border-slate-200 shadow-sm hover:border-slate-300',
    accentClass: 'bg-indigo-600 text-white',
  },
  {
    id: 'sunshine_warm',
    name: 'Güneş Işığı (Sıcak)',
    bgClass: 'bg-[#FFFBEB]',
    cardBgClass: 'bg-amber-50/50 border-amber-200',
    textClass: 'text-amber-950',
    subtitleClass: 'text-amber-700/80',
    phoneBgClass: 'from-amber-100 via-orange-50 to-yellow-50',
    phoneCardBgClass: 'bg-white/90 border-amber-200/60 shadow-sm hover:border-amber-300',
    accentClass: 'bg-amber-600 text-white',
  },
  {
    id: 'neon_cyber',
    name: 'Cyber Neon (Koyu)',
    bgClass: 'bg-[#0F172A]',
    cardBgClass: 'bg-slate-900 border-slate-800',
    textClass: 'text-slate-200',
    subtitleClass: 'text-slate-400',
    phoneBgClass: 'from-slate-950 via-slate-900 to-indigo-950',
    phoneCardBgClass: 'bg-slate-900/80 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] text-white hover:border-cyan-400',
    accentClass: 'bg-cyan-500 text-slate-950',
  },
  {
    id: 'sunset_glow',
    name: 'Sunset Glow',
    bgClass: 'bg-[#FFF5F5]',
    cardBgClass: 'bg-rose-50/50 border-rose-200',
    textClass: 'text-rose-950',
    subtitleClass: 'text-rose-700/80',
    phoneBgClass: 'from-rose-100 via-orange-50 to-amber-50',
    phoneCardBgClass: 'bg-white/90 border-rose-200/60 shadow-sm hover:border-rose-300',
    accentClass: 'bg-rose-600 text-white',
  },
  {
    id: 'forest_fresh',
    name: 'Zümrüt Ormanı',
    bgClass: 'bg-[#F0FDF4]',
    cardBgClass: 'bg-emerald-50/50 border-emerald-200',
    textClass: 'text-emerald-950',
    subtitleClass: 'text-emerald-700/80',
    phoneBgClass: 'from-emerald-100 via-teal-50 to-emerald-50',
    phoneCardBgClass: 'bg-white/90 border-emerald-200/60 shadow-sm hover:border-emerald-300',
    accentClass: 'bg-emerald-600 text-white',
  },
  {
    id: 'royal_indigo',
    name: 'Asil İndigo',
    bgClass: 'bg-[#EEF2FF]',
    cardBgClass: 'bg-indigo-50/50 border-indigo-200',
    textClass: 'text-indigo-950',
    subtitleClass: 'text-indigo-700/80',
    phoneBgClass: 'from-indigo-100 via-purple-50 to-indigo-50',
    phoneCardBgClass: 'bg-white/90 border-indigo-200/60 shadow-sm hover:border-indigo-300',
    accentClass: 'bg-indigo-600 text-white',
  }
];

export default function App() {
  // --- STATE ---
  // Safe extraction of default profile details to handle any ES6 default wrapper differences across builders
  const profileData = defaultProfile && (defaultProfile as any).default ? (defaultProfile as any).default : defaultProfile;

  const [profileTitle, setProfileTitle] = useState<string>(profileData?.profileTitle || 'Ankara Çocuk Rehberi');
  const [profileBio, setProfileBio] = useState<string>(profileData?.profileBio || "Ankara'daki en güncel çocuk etkinlikleri, atölyeler ve aile rehberi burada! ✨");
  const [selectedAvatar, setSelectedAvatar] = useState<string>(profileData?.selectedAvatar || '🧒');
  const [selectedAvatarBg, setSelectedAvatarBg] = useState<string>(profileData?.selectedAvatarBg || 'from-amber-200 to-orange-400');
  const [avatarType, setAvatarType] = useState<'emoji' | 'image'>((profileData?.avatarType as 'emoji' | 'image') || 'emoji');
  const [avatarUrl, setAvatarUrl] = useState<string>(profileData?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80');
  const [activeThemeId, setActiveThemeId] = useState<string>(profileData?.activeThemeId || 'slate_light');
  
  // Custom Links
  const [links, setLinks] = useState<LinkItem[]>((profileData?.links as LinkItem[]) || []);

  // Social Links
  const [socials, setSocials] = useState(profileData?.socials || {
    instagram: 'https://instagram.com',
    whatsapp: 'https://wa.me',
    youtube: '',
    twitter: ''
  });

  // UI Navigation Tabs (Left Control Panel)
  const [controlTab, setControlTab] = useState<'links' | 'design' | 'ai-helper'>('links');
  
  // New Link Builder State
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newIconType, setNewIconType] = useState<LinkItem['iconType']>('web');
  const [newColorTheme, setNewColorTheme] = useState<LinkItem['colorTheme']>('indigo');
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editingLinkData, setEditingLinkData] = useState<LinkItem | null>(null);

  // Copilot Chat States
  const [isChatOpen, setIsChatOpen] = useState<boolean>(true);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: 'Merhaba! Ben Linktree & Bio-Link büyüme asistanınızım. 📈\n\nProfilinizin tıklanma oranını artırmak, bağlantı başlıklarınızı daha ilgi çekici hale getirmek veya takipçilerinizi harekete geçirecek biyografiler yazmak için buradayım. Bana dilediğinizi sorabilirsiniz!',
      timestamp: new Date()
    }
  ]);

  // Interactive UI Simulation States
  const [viewsCount, setViewsCount] = useState<number>(1284);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  
  // AI Generation States
  const [isBioLoading, setIsBioLoading] = useState<boolean>(false);
  const [bioTone, setBioTone] = useState<string>('Sıcak ve Eğlenceli');
  const [isLinksLoading, setIsLinksLoading] = useState<boolean>(false);
  const [nicheCategory, setNicheCategory] = useState<string>('Aile & Çocuk Rehberi');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const activeTheme = THEME_PRESETS.find(t => t.id === activeThemeId) || THEME_PRESETS[0];

  // Calculated clicks
  const totalClicksCount = links.reduce((acc, curr) => acc + curr.clicks, 0);

  // Handle simulate click on link preview inside mock phone
  const handleSimulateClick = (linkId: string) => {
    setLinks(prev => prev.map(lnk => {
      if (lnk.id === linkId) {
        return { ...lnk, clicks: lnk.clicks + 1 };
      }
      return lnk;
    }));
  };

  // Add new link to list
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      alert('Lütfen başlık ve URL girin.');
      return;
    }

    const newLink: LinkItem = {
      id: `link-${Date.now()}`,
      title: newTitle,
      subtitle: newSubtitle,
      url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`,
      iconType: newIconType,
      colorTheme: newColorTheme,
      clicks: 0
    };

    setLinks(prev => [...prev, newLink]);
    // Reset fields
    setNewTitle('');
    setNewSubtitle('');
    setNewUrl('');
    setNewIconType('web');
    setNewColorTheme('indigo');
  };

  // Delete a link
  const handleDeleteLink = (id: string) => {
    setLinks(prev => prev.filter(lnk => lnk.id !== id));
  };

  // Reordering Links
  const moveLink = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= links.length) return;
    const reordered = [...links];
    const temp = reordered[index];
    reordered[index] = reordered[nextIndex];
    reordered[nextIndex] = temp;
    setLinks(reordered);
  };

  // Copy Profile URL helper
  const handleCopyProfileUrl = () => {
    const url = `https://link.bio/ankara-cocuk`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setApiError(null);
    try {
      const response = await fetch('/api/save-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileTitle,
          profileBio,
          selectedAvatar,
          selectedAvatarBg,
          avatarType,
          avatarUrl,
          activeThemeId,
          links,
          socials
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Disk kaydedilirken hata oluştu.');
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || 'Değişiklikler kaydedilemedi.');
    } finally {
      setIsSaving(false);
    }
  };

  // AI API Integration: Generate Bio
  const generateAIBio = async () => {
    setIsBioLoading(true);
    setApiError(null);
    try {
      const response = await fetch('/api/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: profileTitle,
          currentBio: profileBio,
          tone: bioTone
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Biyografi üretilirken hata oluştu.');
      }
      setProfileBio(data.bio);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || 'Yapay zeka servisine bağlanılamadı.');
    } finally {
      setIsBioLoading(false);
    }
  };

  // AI API Integration: Suggest highly converting Links
  const suggestAILinks = async () => {
    setIsLinksLoading(true);
    setApiError(null);
    try {
      const response = await fetch('/api/suggest-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: profileTitle,
          description: profileBio,
          niche: nicheCategory
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Bağlantı önerileri alınamadı.');
      }

      // Convert recommended links to state structure
      const newSuggested: LinkItem[] = data.suggestedLinks.map((item: any, idx: number) => ({
        id: `link-suggested-${Date.now()}-${idx}`,
        title: item.title,
        subtitle: item.subtitle,
        url: item.url,
        iconType: item.iconType,
        colorTheme: item.colorTheme || 'indigo',
        clicks: 0
      }));

      setLinks(prev => [...prev, ...newSuggested]);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || 'Öneriler alınırken hata oluştu.');
    } finally {
      setIsLinksLoading(false);
    }
  };

  // AI API Integration: Chatbot Copilot
  const handleSendChatMessage = async (presetText?: string) => {
    const textToSend = presetText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!presetText) setChatInput('');
    setIsChatLoading(true);
    setApiError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          profileData: {
            title: profileTitle,
            bio: profileBio,
            theme: activeTheme.name,
            links: links
          }
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Yapay zekadan yanıt alınamadı.');
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || 'Yapay zeka ile iletişim hatası.');
    } finally {
      setIsChatLoading(false);
    }
  };

  // Icon Component Mapper for Link Items
  const renderIcon = (type: LinkItem['iconType'], className = "w-5 h-5") => {
    switch (type) {
      case 'whatsapp':
        return <MessageCircle className={className} />;
      case 'instagram':
        return <Instagram className={className} />;
      case 'youtube':
        return <Youtube className={className} />;
      case 'store':
        return <ShoppingBag className={className} />;
      case 'tiktok':
        return <Music className={className} />;
      case 'twitter':
        return <Twitter className={className} />;
      default:
        return <Globe className={className} />;
    }
  };

  // Tailwind Palette Color Map for Links
  const getLinkColorStyles = (color: LinkItem['colorTheme']) => {
    switch (color) {
      case 'emerald':
        return {
          bg: 'bg-emerald-50 hover:bg-emerald-100/70 text-emerald-900 border-emerald-100',
          iconBg: 'bg-emerald-500 text-white'
        };
      case 'amber':
        return {
          bg: 'bg-amber-50 hover:bg-amber-100/70 text-amber-900 border-amber-100',
          iconBg: 'bg-amber-500 text-white'
        };
      case 'rose':
        return {
          bg: 'bg-rose-50 hover:bg-rose-100/70 text-rose-900 border-rose-100',
          iconBg: 'bg-rose-500 text-white'
        };
      case 'violet':
        return {
          bg: 'bg-violet-50 hover:bg-violet-100/70 text-violet-900 border-violet-100',
          iconBg: 'bg-violet-500 text-white'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50 hover:bg-blue-100/70 text-blue-900 border-blue-100',
          iconBg: 'bg-blue-500 text-white'
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-50 hover:bg-indigo-100/70 text-indigo-900 border-indigo-100',
          iconBg: 'bg-indigo-600 text-white'
        };
      default:
        return {
          bg: 'bg-slate-50 hover:bg-slate-100/80 text-slate-900 border-slate-200',
          iconBg: 'bg-slate-700 text-white'
        };
    }
  };

  // Check if we are in public view mode or edit mode
  // If ?edit=true or running locally without ?view=public, we show the admin panel.
  const isEditMode = window.location.search.includes('edit=true') || (window.location.hostname === 'localhost' && !window.location.search.includes('view=public'));

  if (!isEditMode) {
    return (
      <div className={`min-h-screen w-full relative flex flex-col items-center overflow-x-hidden ${activeTheme.bgClass}`}>
        {/* Background gradient from the theme */}
        <div className={`absolute inset-0 bg-gradient-to-b ${activeTheme.phoneBgClass} z-0`} />
        
        {/* Safe layout margin container */}
        <div className="relative z-10 w-full max-w-md flex-1 flex flex-col items-center px-6 pt-16 pb-20">
          
          {/* Avatar frame */}
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4 flex items-center justify-center overflow-hidden shrink-0 bg-slate-200 relative">
            {avatarType === 'emoji' ? (
              <div className={`w-full h-full bg-gradient-to-tr ${selectedAvatarBg} flex items-center justify-center text-5xl`}>
                {selectedAvatar}
              </div>
            ) : (
              <img 
                src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            )}
          </div>

          {/* Profile Title */}
          <h1 className="text-xl font-extrabold text-slate-800 text-center tracking-tight leading-tight w-full px-2">
            {profileTitle || 'Profil Başlığı'}
          </h1>

          {/* Profile Bio */}
          <p className="text-xs text-center text-slate-500 mt-2 mb-8 leading-relaxed max-w-xs px-2 break-words">
            {profileBio || 'Biyografi bilgisi girilmedi.'}
          </p>

          {/* Links List */}
          <div className="w-full space-y-4 flex-1">
            {links.map((link) => {
              const colorStyle = getLinkColorStyles(link.colorTheme);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    try {
                      fetch(`/api/track-click/${link.id}`, { method: 'POST' }).catch(() => {});
                    } catch(e){}
                  }}
                  className={`w-full p-4 border rounded-2xl flex items-center gap-3.5 transition-all duration-300 ${colorStyle.bg} shadow-sm hover:scale-[1.015] hover:-translate-y-0.5`}
                >
                  <div className={`w-10 h-10 rounded-xl ${colorStyle.iconBg} flex items-center justify-center shrink-0`}>
                    {renderIcon(link.iconType, "w-5 h-5")}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold leading-snug truncate">{link.title || 'Bağlantı Başlığı'}</p>
                    {link.subtitle && (
                      <p className="text-xs opacity-75 mt-0.5 leading-relaxed line-clamp-2 break-words">{link.subtitle}</p>
                    )}
                  </div>
                  
                  <ExternalLink size={14} className="text-slate-400 shrink-0" />
                </a>
              );
            })}

            {links.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs">
                Bağlantı bulunmamaktadır.
              </div>
            )}
          </div>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-5 mt-10 pt-6 border-t border-slate-200/40 w-full z-10">
            {socials.instagram && (
              <a href={socials.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                <Instagram size={20} />
              </a>
            )}
            {socials.whatsapp && (
              <a href={socials.whatsapp} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                <MessageCircle size={20} />
              </a>
            )}
            {socials.youtube && (
              <a href={socials.youtube} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                <Youtube size={20} />
              </a>
            )}
            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                <Twitter size={20} />
              </a>
            )}
          </div>

          {/* Fine credit line */}
          <div className="mt-10 text-[10px] text-slate-400 font-bold tracking-wider uppercase">
            Powered by Bio-Link
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden text-slate-800 antialiased font-sans ${activeTheme.bgClass}`}>
      
      {/* --- TOP NAVBAR --- */}
      <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-8 z-30 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-500/10">
            <LinkIcon size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none mb-0.5">
              <span className="text-[9px] font-mono font-bold tracking-widest text-indigo-600 uppercase">Interactive Builder</span>
              <span className="w-1 h-1 rounded-full bg-indigo-300" />
              <span className="text-[9px] font-mono text-slate-400">TR v2.0</span>
            </div>
            <h1 className="text-sm font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Bio-Link Creator & AI Optimizer
            </h1>
          </div>
        </div>

        {/* Global Save Action Trigger */}
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-green-600 font-bold flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
              <Check size={14} /> Değişiklikler Kaydedildi!
            </span>
          )}
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw size={13} className="animate-spin" /> Kaydediliyor...
              </>
            ) : (
              <>
                Değişiklikleri Yayınla
              </>
            )}
          </button>

          {/* AI Copilot Side Toggle */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`relative p-2.5 rounded-xl transition-all border ${
              isChatOpen 
                ? 'bg-indigo-50 border-indigo-100 text-indigo-600 shadow-sm' 
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
            title="Yapay Zeka Yardımcısını Aç/Kapat"
          >
            <MessageSquare size={16} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 border border-white animate-pulse" />
          </button>
        </div>
      </header>

      {/* --- MAIN WORKSPACE WORKFLOW --- */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT PANEL: Editing, Profile, Appearance & Lists Controls */}
        <aside className="w-[360px] h-full bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 shadow-sm">
          
          {/* Navigation Subtabs inside Sidebar */}
          <div className="grid grid-cols-3 border-b border-slate-150 p-2 gap-1 bg-slate-50">
            <button
              onClick={() => setControlTab('links')}
              className={`py-2 text-[11px] font-bold rounded-lg transition flex flex-col items-center gap-1 ${
                controlTab === 'links' 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-100' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LinkIcon size={14} /> Linkler
            </button>
            <button
              onClick={() => setControlTab('design')}
              className={`py-2 text-[11px] font-bold rounded-lg transition flex flex-col items-center gap-1 ${
                controlTab === 'design' 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-100' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Palette size={14} /> Tasarım & Tema
            </button>
            <button
              onClick={() => setControlTab('ai-helper')}
              className={`py-2 text-[11px] font-bold rounded-lg transition flex flex-col items-center gap-1 ${
                controlTab === 'ai-helper' 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-100' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles size={14} className="text-indigo-600" /> AI Önerileri
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Show API Key Error if any */}
            {apiError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-fadeIn">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Yapay Zeka Hatası</p>
                  <p className="opacity-90">{apiError}</p>
                </div>
              </div>
            )}

            {/* TAB 1: LINKS & PROFILE BASIC INFO */}
            {controlTab === 'links' && (
              <div className="space-y-6">
                
                {/* Profile Editor Details */}
                <section className="space-y-3.5">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Profil Kimliği</label>
                  
                  {/* Profile title */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">Sayfa Başlığı</span>
                    <input 
                      type="text" 
                      value={profileTitle} 
                      onChange={(e) => setProfileTitle(e.target.value)}
                      className="w-full text-xs font-bold bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                      placeholder="Ankara Çocuk Rehberi"
                    />
                  </div>

                  {/* Profile bio + AI Assistant Action */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">Biyografi Açıklaması</span>
                      <button
                        onClick={generateAIBio}
                        disabled={isBioLoading}
                        className="text-[9px] font-extrabold text-indigo-600 hover:underline flex items-center gap-1"
                        title="Gemini ile Biyografiyi Optimize Et"
                      >
                        {isBioLoading ? <RefreshCw size={10} className="animate-spin" /> : <Wand2 size={10} />} AI İLE GELİŞTİR
                      </button>
                    </div>
                    <textarea 
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none h-16 resize-none text-slate-700 leading-normal"
                      placeholder="Ankara'daki en renkli çocuk etkinlikleri, atölyeler ve aile rehberi."
                    />
                    
                    {/* Bio tone selector */}
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-semibold">AI Tonu:</span>
                      <select 
                        value={bioTone} 
                        onChange={(e) => setBioTone(e.target.value)}
                        className="bg-transparent text-indigo-600 font-bold border-none outline-none cursor-pointer"
                      >
                        <option value="Sıcak ve Eğlenceli">Sıcak & Eğlenceli</option>
                        <option value="Profesyonel ve Güvenilir">Profesyonel & Güvenilir</option>
                        <option value="Merak Uyandırıcı ve Enerjik">Enerjik & Heyecanlı</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Add New Link Form */}
                <section className="space-y-3.5 pt-2 border-t border-slate-100">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Yeni Bağlantı Ekle</label>
                  
                  <form onSubmit={handleAddLink} className="p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-sm space-y-3">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block mb-1">Bağlantı Başlığı</span>
                      <input 
                        type="text" 
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Örn: WhatsApp Grubu" 
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                      />
                    </div>

                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block mb-1">Kısa Açıklama (Alt Başlık)</span>
                      <input 
                        type="text" 
                        value={newSubtitle}
                        onChange={(e) => setNewSubtitle(e.target.value)}
                        placeholder="Örn: Anlık duyurulardan haberdar ol" 
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                      />
                    </div>

                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block mb-1">Hedef URL Adresi</span>
                      <input 
                        type="text" 
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="chat.whatsapp.com/..." 
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                      />
                    </div>

                    {/* Custom icon picker & Color select */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block mb-1">İkon Türü</span>
                        <select
                          value={newIconType}
                          onChange={(e: any) => setNewIconType(e.target.value)}
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 outline-none"
                        >
                          <option value="web">Web Sitesi 🌐</option>
                          <option value="whatsapp">WhatsApp 💬</option>
                          <option value="instagram">Instagram 📸</option>
                          <option value="youtube">YouTube 🎥</option>
                          <option value="store">Mağaza 🛍️</option>
                          <option value="tiktok">TikTok 🎵</option>
                          <option value="twitter">Twitter / X 🐦</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block mb-1">Kart Rengi</span>
                        <select
                          value={newColorTheme}
                          onChange={(e: any) => setNewColorTheme(e.target.value)}
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 outline-none"
                        >
                          <option value="indigo">Asil İndigo</option>
                          <option value="emerald">Zümrüt Yeşil</option>
                          <option value="blue">Okyanus Mavi</option>
                          <option value="amber">Altın Sarı</option>
                          <option value="rose">Gül Kırmızı</option>
                          <option value="violet">Egzotik Mor</option>
                          <option value="slate">Klasik Slate</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm mt-1"
                    >
                      <Plus size={14} /> Bağlantı Listesine Ekle
                    </button>
                  </form>
                </section>

                {/* Active links list */}
                <section className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Aktif Bağlantılar ({links.length})</label>
                    <span className="text-[9px] text-slate-400 font-semibold">Düzenle / Sırala</span>
                  </div>

                  <div className="space-y-2.5">
                    {links.map((link, index) => {
                      const colorStyle = getLinkColorStyles(link.colorTheme);
                      
                      if (editingLinkId === link.id && editingLinkData) {
                        return (
                          <div key={link.id} className="p-4 bg-indigo-50/40 border border-indigo-200 rounded-xl shadow-sm space-y-3 animate-fadeIn">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold text-indigo-600 uppercase">Bağlantıyı Düzenle</span>
                              <button 
                                onClick={() => {
                                  setEditingLinkId(null);
                                  setEditingLinkData(null);
                                }}
                                className="text-slate-400 hover:text-slate-600"
                              >
                                <X size={14} />
                              </button>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <span className="text-[9px] font-bold text-slate-400 block mb-0.5">Başlık</span>
                                <input 
                                  type="text" 
                                  value={editingLinkData.title}
                                  onChange={(e) => setEditingLinkData(prev => prev ? { ...prev, title: e.target.value } : null)}
                                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                                />
                              </div>

                              <div>
                                <span className="text-[9px] font-bold text-slate-400 block mb-0.5">Alt Başlık (Açıklama)</span>
                                <input 
                                  type="text" 
                                  value={editingLinkData.subtitle}
                                  onChange={(e) => setEditingLinkData(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
                                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                                />
                              </div>

                              <div>
                                <span className="text-[9px] font-bold text-slate-400 block mb-0.5">Hedef URL</span>
                                <input 
                                  type="text" 
                                  value={editingLinkData.url}
                                  onChange={(e) => setEditingLinkData(prev => prev ? { ...prev, url: e.target.value } : null)}
                                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="text-[9px] font-bold text-slate-400 block mb-0.5">İkon Türü</span>
                                  <select
                                    value={editingLinkData.iconType}
                                    onChange={(e: any) => setEditingLinkData(prev => prev ? { ...prev, iconType: e.target.value } : null)}
                                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 outline-none"
                                  >
                                    <option value="web">Web Sitesi 🌐</option>
                                    <option value="whatsapp">WhatsApp 💬</option>
                                    <option value="instagram">Instagram 📸</option>
                                    <option value="youtube">YouTube 🎥</option>
                                    <option value="store">Mağaza 🛍️</option>
                                    <option value="tiktok">TikTok 🎵</option>
                                    <option value="twitter">Twitter / X 🐦</option>
                                  </select>
                                </div>

                                <div>
                                  <span className="text-[9px] font-bold text-slate-400 block mb-0.5">Kart Rengi</span>
                                  <select
                                    value={editingLinkData.colorTheme}
                                    onChange={(e: any) => setEditingLinkData(prev => prev ? { ...prev, colorTheme: e.target.value } : null)}
                                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 outline-none"
                                  >
                                    <option value="indigo">Asil İndigo</option>
                                    <option value="emerald">Zümrüt Yeşil</option>
                                    <option value="blue">Okyanus Mavi</option>
                                    <option value="amber">Altın Sarı</option>
                                    <option value="rose">Gül Kırmızı</option>
                                    <option value="violet">Egzotik Mor</option>
                                    <option value="slate">Klasik Slate</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-1.5">
                              <button
                                onClick={() => {
                                  if (!editingLinkData.title.trim() || !editingLinkData.url.trim()) {
                                    alert('Lütfen başlık ve URL girin.');
                                    return;
                                  }
                                  setLinks(prev => prev.map(lnk => lnk.id === link.id ? { 
                                    ...editingLinkData, 
                                    url: editingLinkData.url.startsWith('http') ? editingLinkData.url : `https://${editingLinkData.url}`
                                  } : lnk));
                                  setEditingLinkId(null);
                                  setEditingLinkData(null);
                                }}
                                className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-sm"
                              >
                                <Check size={12} /> Kaydet
                              </button>
                              <button
                                onClick={() => {
                                  setEditingLinkId(null);
                                  setEditingLinkData(null);
                                }}
                                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1"
                              >
                                Vazgeç
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={link.id} className="p-3 bg-white border border-slate-150 rounded-xl shadow-sm flex items-center gap-2.5 hover:border-slate-300 transition-all">
                          {/* Left Drag indicator simulation and Order actions */}
                          <div className="flex flex-col gap-0.5 shrink-0 text-slate-400">
                            <button 
                              onClick={() => moveLink(index, 'up')}
                              disabled={index === 0}
                              className="p-0.5 hover:text-slate-800 disabled:opacity-30"
                            >
                              <ChevronUp size={14} />
                            </button>
                            <button 
                              onClick={() => moveLink(index, 'down')}
                              disabled={index === links.length - 1}
                              className="p-0.5 hover:text-slate-800 disabled:opacity-30"
                            >
                              <ChevronDown size={14} />
                            </button>
                          </div>

                          {/* Icon representation */}
                          <div className={`w-8 h-8 rounded-lg ${colorStyle.iconBg} flex items-center justify-center shrink-0`}>
                            {renderIcon(link.iconType, "w-4.5 h-4.5")}
                          </div>

                          {/* Context */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">{link.title}</h4>
                            <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-2 break-words leading-relaxed">{link.subtitle || link.url}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <MousePointerClick size={10} /> {link.clicks} tıklama
                              </span>
                            </div>
                          </div>

                          {/* Actions: Edit & Delete */}
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              onClick={() => {
                                setEditingLinkId(link.id);
                                setEditingLinkData({ ...link });
                              }}
                              className="p-1.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors shrink-0"
                              title="Bağlantıyı Düzenle"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteLink(link.id)}
                              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors shrink-0"
                              title="Bağlantıyı Sil"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {links.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        Henüz hiç aktif bağlantı eklemediniz.
                      </p>
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* TAB 2: APPEARANCE, THEME SELECTOR & AVATAR SETTINGS */}
            {controlTab === 'design' && (
              <div className="space-y-6">
                
                {/* Avatar Settings */}
                <section className="space-y-3.5">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Avatar Simgesi</label>
                  
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-sm space-y-4">
                    {/* Toggle between Emoji and Image */}
                    <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg">
                      <button
                        onClick={() => setAvatarType('emoji')}
                        className={`py-1.5 text-xs font-bold rounded-md transition ${
                          avatarType === 'emoji' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Emoji
                      </button>
                      <button
                        onClick={() => setAvatarType('image')}
                        className={`py-1.5 text-xs font-bold rounded-md transition ${
                          avatarType === 'image' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Görsel (Resim)
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Live Selected Avatar Circle */}
                      <div className="w-14 h-14 rounded-full border-2 border-white shadow-md overflow-hidden shrink-0 bg-slate-200">
                        {avatarType === 'emoji' ? (
                          <div className={`w-full h-full bg-gradient-to-tr ${selectedAvatarBg} flex items-center justify-center text-3xl`}>
                            {selectedAvatar}
                          </div>
                        ) : (
                          <img 
                            src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'} 
                            alt="Avatar Preview" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>

                      {/* Content depending on Avatar Type */}
                      <div className="flex-1 min-w-0">
                        {avatarType === 'emoji' ? (
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block mb-1">Emoji Seç</span>
                            <div className="grid grid-cols-4 gap-1.5">
                              {['🧒', '👶', '🎨', '🚀', '🍕', '🎸', '🌟', '📚'].map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => setSelectedAvatar(emoji)}
                                  className={`p-1.5 text-lg rounded-lg border bg-white transition-all ${
                                    selectedAvatar === emoji ? 'border-indigo-500 ring-2 ring-indigo-100 scale-105' : 'border-slate-100 hover:border-slate-300'
                                  }`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 block mb-1">Cihazdan Resim Yükle</span>
                              <input
                                type="file"
                                accept="image/*"
                                id="avatar-file-upload"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      if (typeof reader.result === 'string') {
                                        setAvatarUrl(reader.result);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <label
                                htmlFor="avatar-file-upload"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-bold cursor-pointer transition w-full justify-center"
                              >
                                <Plus size={13} /> Bilgisayardan Seç
                              </label>
                            </div>

                            <div>
                              <span className="text-[9px] font-bold text-slate-400 block mb-1">Veya Resim URL Adresi</span>
                              <input
                                type="text"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                placeholder="https://domain.com/resim.png"
                                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Gradient theme selector - only show for Emoji type */}
                    {avatarType === 'emoji' && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block mb-1.5">Avatar Arka Plan Gradyanı</span>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: 'from-amber-200 to-orange-400', label: 'Gold' },
                            { id: 'from-indigo-400 to-purple-600', label: 'Indigo' },
                            { id: 'from-emerald-400 to-teal-600', label: 'Emerald' },
                            { id: 'from-rose-400 to-red-600', label: 'Sunset' },
                            { id: 'from-cyan-400 to-blue-600', label: 'Okyanus' }
                          ].map(grad => (
                            <button
                              key={grad.id}
                              onClick={() => setSelectedAvatarBg(grad.id)}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded-full border bg-white transition ${
                                selectedAvatarBg === grad.id ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-100'
                              }`}
                            >
                              <span className={`inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-tr ${grad.id} mr-1.5 align-middle`} />
                              {grad.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Social links custom input section */}
                <section className="space-y-3 pt-2 border-t border-slate-100">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Sosyal Ağ Bağlantıları</label>
                  
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-sm space-y-3">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block mb-1">Instagram Profili</span>
                      <input 
                        type="text" 
                        value={socials.instagram}
                        onChange={(e) => setSocials(prev => ({ ...prev, instagram: e.target.value }))}
                        placeholder="https://instagram.com/kullanici"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 outline-none text-slate-800"
                      />
                    </div>

                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block mb-1">WhatsApp Hattı / Grubu</span>
                      <input 
                        type="text" 
                        value={socials.whatsapp}
                        onChange={(e) => setSocials(prev => ({ ...prev, whatsapp: e.target.value }))}
                        placeholder="https://wa.me/numara"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 outline-none text-slate-800"
                      />
                    </div>

                    <div>
                      <span className="text-[9px] font-bold text-slate-400 block mb-1">YouTube Kanalı (İsteğe Bağlı)</span>
                      <input 
                        type="text" 
                        value={socials.youtube}
                        onChange={(e) => setSocials(prev => ({ ...prev, youtube: e.target.value }))}
                        placeholder="https://youtube.com/kanal"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 outline-none text-slate-800"
                      />
                    </div>
                  </div>
                </section>

                {/* Theme presets grid */}
                <section className="space-y-3 pt-2 border-t border-slate-100">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Tema Seçenekleri</label>
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    {THEME_PRESETS.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => setActiveThemeId(preset.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          activeThemeId === preset.id 
                            ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-500/10' 
                            : 'border-slate-150 bg-white hover:border-slate-350'
                        }`}
                      >
                        <span className="text-xs font-bold block text-slate-800">{preset.name}</span>
                        <div className="flex gap-1 mt-2">
                          <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${preset.phoneBgClass} border border-slate-200`} />
                          <span className="w-10 h-3.5 rounded bg-slate-100 border border-slate-150 inline-block" />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* TAB 3: GEMINI AI HELPER MAGICS */}
            {controlTab === 'ai-helper' && (
              <div className="space-y-6">
                
                {/* AI Bio Optimization tool */}
                <section className="space-y-3">
                  <h3 className="text-xs font-extrabold text-indigo-600 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles size={13} /> Gemini AI Biyografi Sihirbazı
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Profilinizin amacına ve hedef kitlesine göre dikkat çekici, yüksek etkileşimli biyografi yazıları üretir.
                  </p>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl shadow-sm space-y-3.5">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">AI Ses Tonu & Stil Seçin</span>
                      <select
                        value={bioTone}
                        onChange={(e) => setBioTone(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 outline-none"
                      >
                        <option value="Sıcak ve Eğlenceli">Eğlenceli ve Sıcak 🧒</option>
                        <option value="Profesyonel ve Güvenilir">Kurumsal ve Profesyonel 💼</option>
                        <option value="Merak Uyandırıcı ve Enerjik">Heyecanlı ve Enerjik 🚀</option>
                        <option value="Kısa, Net ve Minimalist">Minimalist ve Sade ✨</option>
                      </select>
                    </div>

                    <button
                      onClick={generateAIBio}
                      disabled={isBioLoading}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      {isBioLoading ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" /> Yapay Zeka Yazıyor...
                        </>
                      ) : (
                        <>
                          <Wand2 size={13} /> Biyografiyi Yeniden Yazdır
                        </>
                      )}
                    </button>
                  </div>
                </section>

                {/* AI Suggested Links Builder (Lead Generation ideas) */}
                <section className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-extrabold text-indigo-600 flex items-center gap-1.5 uppercase tracking-wider">
                    <Wand2 size={13} /> AI Link Önerileri Sihirbazı
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Profilinizin kategorisine göre en çok dönüşüm getirecek 3 bağlantı önerisi hazırlar ve doğrudan listenize ekler.
                  </p>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl shadow-sm space-y-3.5">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">Niş / Kategori Belirtin</span>
                      <input
                        type="text"
                        value={nicheCategory}
                        onChange={(e) => setNicheCategory(e.target.value)}
                        placeholder="Örn: Yerel Çocuk Etkinlikleri Rehberi"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 font-bold"
                      />
                    </div>

                    <button
                      onClick={suggestAILinks}
                      disabled={isLinksLoading}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      {isLinksLoading ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" /> Öneriler Alınıyor...
                        </>
                      ) : (
                        <>
                          <PlusCircle size={13} /> AI Bağlantı Önerilerini Getir
                        </>
                      )}
                    </button>
                  </div>
                </section>

              </div>
            )}

          </div>

          {/* Quick Stats overview footer inside Admin Sidebar */}
          <div className="p-4 bg-slate-900 text-white text-xs space-y-2 shrink-0">
            <div className="flex justify-between items-center text-slate-400 text-[10px] tracking-wider uppercase font-extrabold">
              <span>Hızlı Analiz Panel</span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block font-semibold">Görüntülenme</span>
                <span className="text-sm font-extrabold text-white">{viewsCount}</span>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block font-semibold">Tıklama</span>
                <span className="text-sm font-extrabold text-indigo-400">{totalClicksCount}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MIDDLE PANEL: Elegant Mobile Mock Showcase with custom theme elements */}
        <main className="flex-1 bg-[#f1f5f9] flex flex-col relative overflow-hidden">
          
          {/* Header toolbar for mock preview actions */}
          <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-slate-100 rounded-full text-[11px] font-semibold text-slate-500 font-mono border border-slate-200/50">
                https://link.bio/ankara-cocuk
              </div>
              <button 
                onClick={handleCopyProfileUrl}
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
                title="Profil Linkini Kopyala"
              >
                {isCopied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
                <Eye size={12} className="text-slate-500 animate-pulse" /> Canlı Önizleme Modu
              </span>
            </div>
          </header>

          {/* Actual Phone mockup frame content container */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
            
            {/* Real phone frame representation styling */}
            <div className="relative w-[345px] h-[645px] bg-slate-950 rounded-[50px] shadow-[0_20px_60px_rgba(15,23,42,0.18)] border-[10px] border-slate-900 overflow-hidden shrink-0 flex flex-col">
              
              {/* Dynamic camera notch element */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-40" />
              
              {/* Actual Linktree content frame container */}
              <div className="flex-1 w-full bg-white relative flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar">
                
                {/* Dynamically assigned layout style backgrounds */}
                <div className={`absolute inset-0 bg-gradient-to-b ${activeTheme.phoneBgClass} z-0`} />

                {/* Safe layout margin container */}
                <div className="relative z-10 flex-1 flex flex-col items-center px-5 pt-16 pb-12">
                  
                  {/* Dynamic Avatar frame */}
                  <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg mb-3 flex items-center justify-center overflow-hidden shrink-0 bg-slate-200 relative animate-fadeIn">
                    {avatarType === 'emoji' ? (
                      <div className={`w-full h-full bg-gradient-to-tr ${selectedAvatarBg} flex items-center justify-center text-4xl`}>
                        {selectedAvatar}
                      </div>
                    ) : (
                      <img 
                        src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'} 
                        alt="Avatar Preview" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>

                  {/* Profile texts with dynamic styling mapping */}
                  <h1 className="text-lg font-extrabold text-slate-800 text-center tracking-tight leading-tight w-full truncate px-2">
                    {profileTitle || 'Profil Başlığı'}
                  </h1>

                  <p className="text-[11px] text-center text-slate-500 mt-1.5 mb-6 leading-relaxed max-w-[240px] px-2 break-words">
                    {profileBio || 'Biyografi bilgisi girilmedi.'}
                  </p>

                  {/* Links Loop with interactive click simulator triggers */}
                  <div className="w-full space-y-3 flex-1">
                    {links.map((link) => {
                      const colorStyle = getLinkColorStyles(link.colorTheme);
                      return (
                        <motion.div
                          key={link.id}
                          whileHover={{ scale: 1.015, y: -1 }}
                          whileTap={{ scale: 0.995 }}
                          onClick={() => handleSimulateClick(link.id)}
                          className={`w-full p-3.5 border rounded-2xl cursor-pointer flex items-center gap-3 transition-all duration-300 ${colorStyle.bg} shadow-sm`}
                        >
                          <div className={`w-9 h-9 rounded-xl ${colorStyle.iconBg} flex items-center justify-center shrink-0`}>
                            {renderIcon(link.iconType, "w-4.5 h-4.5")}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-extrabold leading-snug truncate">{link.title || 'Bağlantı Başlığı'}</p>
                            {link.subtitle && (
                              <p className="text-[10px] opacity-75 mt-0.5 leading-relaxed line-clamp-2 break-words">{link.subtitle}</p>
                            )}
                          </div>
                          
                          <ExternalLink size={11} className="text-slate-400 shrink-0" />
                        </motion.div>
                      );
                    })}

                    {links.length === 0 && (
                      <div className="text-center py-12 text-slate-400 text-xs">
                        Bağlantı bulunmamaktadır.
                      </div>
                    )}
                  </div>

                  {/* Simulated Social Media Icon Bar */}
                  <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-slate-200/40 w-full z-10">
                    {socials.instagram && (
                      <a href={socials.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                        <Instagram size={18} />
                      </a>
                    )}
                    {socials.whatsapp && (
                      <a href={socials.whatsapp} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                        <MessageCircle size={18} />
                      </a>
                    )}
                    {socials.youtube && (
                      <a href={socials.youtube} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                        <Youtube size={18} />
                      </a>
                    )}
                    {socials.twitter && (
                      <a href={socials.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                        <Twitter size={18} />
                      </a>
                    )}
                  </div>

                  {/* Fine credit line */}
                  <div className="mt-8 text-[9px] text-slate-400 font-bold tracking-wider uppercase">
                    Powered by Bio-Link
                  </div>

                </div>

                {/* Simulated Share floating action bubble inside phone frame */}
                <div className="absolute bottom-6 right-5 z-20">
                  <button 
                    onClick={() => setIsShareModalOpen(true)}
                    className="w-10 h-10 bg-white hover:bg-slate-50 rounded-full shadow-lg border border-slate-150 flex items-center justify-center text-slate-600 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Share2 size={15} />
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* Bottom simulated toolbar with page stats triggers */}
          <footer className="h-16 bg-white border-t border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Statü</span>
                <span className="text-xs font-extrabold text-green-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Yayında
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Sayfa Planı</span>
                <span className="text-xs font-extrabold text-indigo-600 uppercase">PROFESSIONAL PLUS</span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button 
                onClick={handleCopyProfileUrl}
                className="px-4 py-2 border border-slate-250 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                QR Kodu İndir
              </button>
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                Önizlemeyi Paylaş
              </button>
            </div>
          </footer>
        </main>

        {/* RIGHT PANEL: Gemini AI Copilot Chat Workstation */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '360px', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="h-full border-l border-slate-200 bg-white flex flex-col overflow-hidden relative z-20 shadow-[0_0_40px_rgba(15,23,42,0.04)] shrink-0"
            >
              {/* Sidebar Header */}
              <div className="px-5 h-14 border-b border-slate-150 flex items-center justify-between shrink-0 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-indigo-600" />
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Gemini AI Copilot</span>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Chat conversations history stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    } max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
                  >
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-150 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line">
                        {msg.content}
                      </p>
                    </div>

                    {/* AI action integrations for copilot suggestions */}
                    {msg.role === 'assistant' && msg.id !== 'msg-init' && (
                      <div className="flex items-center gap-2 mt-1.5 px-1 text-[9px] text-slate-400">
                        <span>Gemini Önerisi</span>
                      </div>
                    )}
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex flex-col items-start max-w-[85%] mr-auto">
                    <div className="bg-white border border-slate-150 text-slate-500 p-3.5 rounded-2xl rounded-tl-none text-xs flex items-center gap-2 shadow-sm">
                      <div className="flex gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span className="font-semibold text-[10px] text-slate-400">Gemini yazıyor...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Preset prompt helper tags */}
              <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 shrink-0">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Hızlı Soru Kalıpları</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Tıklama oranımı nasıl artırabilirim?',
                    'Bana etkileyici link başlıkları öner',
                    'Daha fazla takipçi kazanma stratejileri'
                  ].map((preset, index) => (
                    <button
                      key={index}
                      disabled={isChatLoading}
                      onClick={() => handleSendChatMessage(preset)}
                      className="px-2.5 py-1 text-[10px] bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 text-slate-600 rounded-lg text-left transition disabled:opacity-50 font-semibold shadow-sm"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive prompt message text input form */}
              <div className="p-4 border-t border-slate-150 shrink-0 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendChatMessage();
                    }}
                    placeholder="Büyüme taktikleri veya fikirler sorun..."
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                    disabled={isChatLoading}
                  />
                  <button
                    disabled={isChatLoading || !chatInput.trim()}
                    onClick={() => handleSendChatMessage()}
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors disabled:bg-slate-300 shadow-sm shrink-0"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>

            </motion.aside>
          )}
        </AnimatePresence>

      </div>

      {/* --- FLOATING SHARE PREVIEW DIALOG MODAL --- */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 relative"
            >
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
              >
                <X size={16} />
              </button>

              <div className="text-center space-y-4 pt-2">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Share2 size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Önizlemeyi Paylaşın</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Bio-Link sayfanız şu anda internette yayında. Aşağıdaki linki kopyalayarak Instagram, TikTok veya Twitter biyografinizde paylaşabilirsiniz.
                  </p>
                </div>

                {/* Copy visual bar */}
                <div className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[11px] font-mono text-slate-500 truncate flex-1 pl-2 text-left">
                    https://link.bio/ankara-cocuk
                  </span>
                  <button 
                    onClick={handleCopyProfileUrl}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-extrabold transition shrink-0 shadow-sm"
                  >
                    {isCopied ? 'Kopyalandı!' : 'Kopyala'}
                  </button>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => setIsShareModalOpen(false)}
                    className="w-full py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
