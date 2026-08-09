import React, { useState, useEffect, useRef } from 'react';
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
  MessageSquare,
  BarChart3,
  GraduationCap,
  Utensils,
  ShieldCheck,
  Users,
  Calendar,
  QrCode
} from 'lucide-react';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { WeeklyMenuModal } from './components/WeeklyMenuModal';
import { LoginModal } from './components/LoginModal';
import { ParentLeadsModal } from './components/ParentLeadsModal';
import { PresetSelectorModal } from './components/PresetSelectorModal';
import { ParentLead } from './types';


// Google Play Store Icon Component
const PlayStoreIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3.25 3.12891C3.25 2.67969 3.39258 2.32983 3.60858 2.11475L13.79 12.2961L3.60858 22.4775C3.39258 22.2624 3.25 21.9126 3.25 21.4633V3.12891Z" fill="#EA4335"/>
    <path d="M17.1802 15.6865L13.79 12.2963L17.1802 8.90614L21.2752 11.2346C22.4192 11.8856 22.4192 12.9468 21.2752 13.5979L17.1802 15.6865Z" fill="#FBBC05"/>
    <path d="M3.60858 2.11475C3.93658 1.78675 4.46858 1.84475 5.07258 2.18675L17.1802 8.90614L13.79 12.2963L3.60858 2.11475Z" fill="#34A853"/>
    <path d="M3.60858 22.4775L13.79 12.2963L17.1802 15.6865L5.07258 22.4059C4.46858 22.7479 3.93658 22.8059 3.60858 22.4775Z" fill="#4285F4"/>
  </svg>
);

// Interfaces for our state
interface LinkItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  iconType: 'web' | 'whatsapp' | 'instagram' | 'youtube' | 'store' | 'tiktok' | 'twitter' | 'discord' | 'telegram' | 'play';
  colorTheme: 'blue' | 'emerald' | 'amber' | 'rose' | 'violet' | 'indigo' | 'slate' | 'white';
  clicks: number;
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

// Framer Motion Animation Variants for Modern aesthetics
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 80, 
      damping: 15 
    } 
  }
};

const linkVariants = {
  hidden: { y: 25, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 70, 
      damping: 14 
    } 
  }
};

const socialVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  show: { 
    scale: 1, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 100, 
      delay: 0.5 
    } 
  }
};

export default function App() {
  // --- STATE ---
  const profileData = defaultProfile && (defaultProfile as any).default ? (defaultProfile as any).default : defaultProfile;

  const [profilesList, setProfilesList] = useState<{ id: string; title: string }[]>([]);
  const lastTrackedUrlRef = useRef<string>(
    typeof window !== 'undefined' ? window.location.pathname + window.location.search : ''
  );
  const [currentProfileId, setCurrentProfileId] = useState<string>('ankara-cocuk-rehberi');
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProfileTitle, setNewProfileTitle] = useState('');
  const [cloneSourceProfile, setCloneSourceProfile] = useState('');

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
  const [controlTab, setControlTab] = useState<'links' | 'design'>('links');
  
  // New Link Builder State
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newIconType, setNewIconType] = useState<LinkItem['iconType']>('web');
  const [newColorTheme, setNewColorTheme] = useState<LinkItem['colorTheme']>('indigo');
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editingLinkData, setEditingLinkData] = useState<LinkItem | null>(null);

  // Interactive UI Simulation States
  const [viewsCount, setViewsCount] = useState<number>(0);
  const [localIps, setLocalIps] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Institutional & Enterprise SaaS States
  const [userRole, setUserRole] = useState<'guest' | 'school' | 'superadmin'>('guest');
  const [parentLeads, setParentLeads] = useState<ParentLead[]>([]);
  const [whatsappNotifyNumber, setWhatsappNotifyNumber] = useState<string>('905000000000');
  const [weeklyMenuUrl, setWeeklyMenuUrl] = useState<string>('');
  const [weeklyMenuTitle, setWeeklyMenuTitle] = useState<string>('Haftalık Yemek Menüsü');

  // Modals visibility
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLeadsModalOpen, setIsLeadsModalOpen] = useState(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);


  // Slugify helper
  const slugify = (text: string) => {
    const trMap: Record<string, string> = {
      'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'I': 'i', 'İ': 'i',
      'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u'
    };
    let str = text;
    for (const key in trMap) {
      str = str.replace(new RegExp(key, 'g'), trMap[key]);
    }
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Helper to extract query parameters
  const getQueryParam = (name: string) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  };

  // Fetch list of profiles and active profile on mount / query param change
  useEffect(() => {
    const initApp = async () => {
      setIsLoadingProfile(true);
      try {
        // 1. Fetch profiles list
        let fetchedProfiles: { id: string; title: string }[] = [];
        try {
          const res = await fetch('/api/profiles');
          const data = await res.json();
          if (data.success) {
            fetchedProfiles = data.profiles;
          }
        } catch (e) {
          const res = await fetch('/profiles/registry.json');
          fetchedProfiles = await res.json();
        }
        setProfilesList(fetchedProfiles);

        // Fetch server local IP addresses for phone testing
        try {
          const res = await fetch('/api/server-info');
          const data = await res.json();
          if (data.success && data.localIps) {
            setLocalIps(data.localIps);
          }
        } catch (e) {
          console.log("Could not load server-info:", e);
        }

        // 2. Determine active profile ID
        const pathname = window.location.pathname;
        const isPublicPath = pathname.startsWith('/p/');
        const profileIdFromPath = isPublicPath ? pathname.substring(3) : null;
        const urlProfile = profileIdFromPath || getQueryParam('profile');
        let activeId = 'ankara-cocuk-rehberi';
        if (urlProfile && fetchedProfiles.some(p => p.id === urlProfile)) {
          activeId = urlProfile;
        } else if (fetchedProfiles.length > 0) {
          activeId = fetchedProfiles[0].id;
        }
        setCurrentProfileId(activeId);

        // 3. Load active profile details
        let activeProfileData: any = null;
        try {
          const res = await fetch(`/api/profile/${activeId}`);
          const data = await res.json();
          if (data.success) {
            activeProfileData = data.profile;
          }
        } catch (e) {
          const res = await fetch(`/profiles/${activeId}.json`);
          activeProfileData = await res.json();
        }

        // Apply profile data to state
        if (activeProfileData) {
          setProfileTitle(activeProfileData.profileTitle || '');
          setProfileBio(activeProfileData.profileBio || '');
          setSelectedAvatar(activeProfileData.selectedAvatar || '🧒');
          setSelectedAvatarBg(activeProfileData.selectedAvatarBg || 'from-amber-200 to-orange-400');
          setAvatarType((activeProfileData.avatarType as 'emoji' | 'image') || 'emoji');
          setAvatarUrl(activeProfileData.avatarUrl || '');
          setActiveThemeId(activeProfileData.activeThemeId || 'slate_light');
          setLinks(activeProfileData.links || []);
          setSocials(activeProfileData.socials || { instagram: '', whatsapp: '', youtube: '', twitter: '' });
          setViewsCount(activeProfileData.views || 0);
          setParentLeads(activeProfileData.leads || []);
          setWhatsappNotifyNumber(activeProfileData.whatsappNotifyNumber || '905000000000');
          setWeeklyMenuUrl(activeProfileData.weeklyMenuUrl || '');
          setWeeklyMenuTitle(activeProfileData.weeklyMenuTitle || 'Haftalık Yemek Menüsü');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setApiError('Profil yüklenirken bir hata oluştu.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    initApp();
  }, []);

  // Increment view count when in public view mode
  useEffect(() => {
    const isPublic = window.location.search.includes('view=public') || 
                     (!window.location.search.includes('edit=true') && window.location.hostname !== 'localhost');
    if (isPublic && currentProfileId && !isLoadingProfile) {
      fetch(`/api/track-view/${currentProfileId}`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setViewsCount(data.views);
          }
        })
        .catch(() => {});

      // Track pageview hit in Yandex.Metrika for SPA navigation, avoiding duplicate views
      if (typeof window !== 'undefined' && (window as any).ym) {
        try {
          const currentUrl = window.location.pathname + window.location.search;
          if (currentUrl !== lastTrackedUrlRef.current) {
            (window as any).ym(111103961, 'hit', currentUrl);
            lastTrackedUrlRef.current = currentUrl;
          }
        } catch (e) {
          console.warn('Yandex.Metrika pageview tracking error:', e);
        }
      }
    }
  }, [currentProfileId, isLoadingProfile]);

  const handleSwitchProfile = async (profileId: string) => {
    setIsLoadingProfile(true);
    setApiError(null);
    try {
      let activeProfileData: any = null;
      try {
        const res = await fetch(`/api/profile/${profileId}`);
        const data = await res.json();
        if (data.success) {
          activeProfileData = data.profile;
        }
      } catch (e) {
        const res = await fetch(`/profiles/${profileId}.json`);
        activeProfileData = await res.json();
      }

      if (activeProfileData) {
        setCurrentProfileId(profileId);
        setProfileTitle(activeProfileData.profileTitle || '');
        setProfileBio(activeProfileData.profileBio || '');
        setSelectedAvatar(activeProfileData.selectedAvatar || '🧒');
        setSelectedAvatarBg(activeProfileData.selectedAvatarBg || 'from-amber-200 to-orange-400');
        setAvatarType((activeProfileData.avatarType as 'emoji' | 'image') || 'emoji');
        setAvatarUrl(activeProfileData.avatarUrl || '');
        setActiveThemeId(activeProfileData.activeThemeId || 'slate_light');
        setLinks(activeProfileData.links || []);
        setSocials(activeProfileData.socials || { instagram: '', whatsapp: '', youtube: '', twitter: '' });
        setViewsCount(activeProfileData.views || 0);
        
        // Update URL
        const params = new URLSearchParams(window.location.search);
        params.set('profile', profileId);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, '', newUrl);
      }
    } catch (err) {
      console.error('Error switching profile:', err);
      setApiError('Profil değiştirilemedi.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const refreshStats = async () => {
    if (!currentProfileId) return;
    try {
      const res = await fetch(`/api/profile/${currentProfileId}`);
      const data = await res.json();
      if (data.success && data.profile) {
        setViewsCount(data.profile.views || 0);
        setLinks(prevLinks => {
          return prevLinks.map(prevLnk => {
            const serverLnk = (data.profile.links || []).find((l: any) => l.id === prevLnk.id);
            return {
              ...prevLnk,
              clicks: serverLnk ? (serverLnk.clicks || 0) : prevLnk.clicks
            };
          });
        });
      }
    } catch (e) {
      console.error("Failed to refresh statistics:", e);
    }
  };

  const handleResetStats = async () => {
    if (!currentProfileId) return;
    if (!window.confirm("Tüm istatistikleri (görüntülenme ve tıklamalar) sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/reset-stats/${currentProfileId}`, { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setViewsCount(0);
        setLinks(prev => prev.map(lnk => ({ ...lnk, clicks: 0 })));
        alert("İstatistikler başarıyla sıfırlandı.");
      } else {
        alert(data.error || "İstatistikler sıfırlanamadı.");
      }
    } catch (e: any) {
      console.error(e);
      alert("Bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileTitle.trim()) {
      alert('Lütfen bir profil adı girin.');
      return;
    }
    const slugId = slugify(newProfileTitle);
    if (!slugId) {
      alert('Geçersiz profil adı.');
      return;
    }
    
    setIsSaving(true);
    setApiError(null);
    try {
      const response = await fetch('/api/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: slugId,
          title: newProfileTitle.trim(),
          cloneFrom: cloneSourceProfile || undefined
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Profil oluşturulamadı.');
      }
      
      setProfilesList(prev => [...prev, { id: slugId, title: newProfileTitle.trim() }]);
      setIsCreateModalOpen(false);
      setNewProfileTitle('');
      setCloneSourceProfile('');
      await handleSwitchProfile(slugId);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Profil oluşturulamadı.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (currentProfileId === 'ankara-cocuk-rehberi') {
      alert('Varsayılan profil silinemez.');
      return;
    }
    if (!confirm(`"${profileTitle}" profilini tamamen silmek istediğinize emin misiniz?`)) {
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch(`/api/profile/${currentProfileId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Profil silinemedi.');
      }
      
      const remainingProfiles = profilesList.filter(p => p.id !== currentProfileId);
      setProfilesList(remainingProfiles);
      if (remainingProfiles.length > 0) {
        await handleSwitchProfile(remainingProfiles[0].id);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Profil silinemedi.');
    } finally {
      setIsSaving(false);
    }
  };

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameProfileTitle, setRenameProfileTitle] = useState('');
  const [renameProfileSlug, setRenameProfileSlug] = useState('');

  const handleOpenRenameModal = () => {
    setRenameProfileTitle(profileTitle);
    setRenameProfileSlug(currentProfileId);
    setIsRenameModalOpen(true);
  };

  const handleRenameProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameProfileTitle.trim()) {
      alert('Lütfen geçerli bir başlık girin.');
      return;
    }
    const cleanSlug = slugify(renameProfileSlug);
    if (!cleanSlug) {
      alert('Geçersiz profil linki.');
      return;
    }

    setIsSaving(true);
    setApiError(null);
    try {
      const response = await fetch(`/api/rename-profile/${currentProfileId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newId: cleanSlug,
          newTitle: renameProfileTitle.trim()
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Profil ismi değiştirilemedi.');
      }

      setProfilesList(prev => prev.map(p => {
        if (p.id === currentProfileId) {
          return { id: cleanSlug, title: renameProfileTitle.trim() };
        }
        return p;
      }));

      setProfileTitle(renameProfileTitle.trim());
      setCurrentProfileId(cleanSlug);

      const params = new URLSearchParams(window.location.search);
      params.set('profile', cleanSlug);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({}, '', newUrl);

      setIsRenameModalOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Profil ismi değiştirilemedi.');
    } finally {
      setIsSaving(false);
    }
  };

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

  // Resolve public url dynamically, defaulting to the production Vercel domain if run locally
  const getPublicUrl = () => {
    const domain = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'https://linklerimiz.vercel.app'
      : window.location.origin;
    return `${domain}/p/${currentProfileId}`;
  };

  // Copy Profile URL helper
  const handleCopyProfileUrl = () => {
    const url = getPublicUrl();
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
      const response = await fetch(`/api/save-profile/${currentProfileId}`, {
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
          socials,
          views: viewsCount,
          leads: parentLeads,
          whatsappNotifyNumber,
          weeklyMenuUrl,
          weeklyMenuTitle
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Disk kaydedilirken hata oluştu.');
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);

      // Update registry locally
      setProfilesList(prev => prev.map(p => {
        if (p.id === currentProfileId) {
          return { ...p, title: profileTitle };
        }
        return p;
      }));
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || 'Değişiklikler kaydedilemedi.');
    } finally {
      setIsSaving(false);
    }
  };



  // Icon Component Mapper for Link Items
  const renderIcon = (type: LinkItem['iconType'], className = "w-5 h-5") => {
    switch (type) {
      case 'form':
        return <GraduationCap className={className} />;
      case 'menu':
        return <Utensils className={className} />;
      case 'calendar':
        return <Calendar className={className} />;
      case 'map':
        return <Globe className={className} />;
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
      case 'play':
        return <PlayStoreIcon className={className} />;
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
      case 'white':
        return {
          bg: 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
          iconBg: 'bg-slate-100 text-slate-600'
        };
      default:
        return {
          bg: 'bg-slate-50 hover:bg-slate-100/80 text-slate-900 border-slate-200',
          iconBg: 'bg-slate-700 text-white'
        };
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-200">
        <RefreshCw className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-sm font-bold text-slate-400">Profil yükleniyor...</p>
      </div>
    );
  }

  // Check if we are in public view mode or edit mode
  // If ?edit=true or running locally without ?view=public, we show the admin panel.
  const isEditMode = window.location.search.includes('edit=true') || (window.location.hostname === 'localhost' && !window.location.search.includes('view=public'));

  if (!isEditMode) {
    if (apiError) {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-200 p-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-xl">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
            <h2 className="text-md font-extrabold">Profil Yayınlanmadı</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              "{currentProfileId}" isimli profil dosyası sunucuda henüz bulunamadı.
            </p>
            <div className="bg-slate-950/40 p-4 rounded-xl text-left space-y-2">
              <span className="text-[9px] text-indigo-400 font-bold block uppercase tracking-wider">Nasıl Yayınlanır?</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                1. Bilgisayarınızda **guncelle.bat** dosyasını çalıştırın.<br/>
                2. İşlem bittikten 15-20 saniye sonra bu sayfayı yenileyin.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`min-h-screen w-full relative flex flex-col items-center overflow-x-hidden ${activeTheme.bgClass}`}>
        {/* Background gradient from the theme */}
        <div className={`absolute inset-0 bg-gradient-to-b ${activeTheme.phoneBgClass} z-0`} />
        
        {/* Safe layout margin container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-10 w-full max-w-md flex-1 flex flex-col items-center px-6 pt-12 pb-20 animate-fadeIn"
        >
          {/* Glowing blur blobs behind the profile card for a modern depth effect */}
          <div className="absolute top-10 left-12 w-44 h-44 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none z-0" />
          <div className="absolute top-36 right-12 w-44 h-44 bg-purple-400/20 rounded-full blur-3xl pointer-events-none z-0" />
          
          {/* Profile Header Card (Glassmorphism) */}
          <motion.div 
            variants={cardVariants}
            className={`w-full p-6 rounded-[28px] flex flex-col items-center mb-8 relative overflow-hidden z-10 backdrop-blur-md border ${
              activeTheme.id === 'neon_cyber'
                ? 'bg-slate-950/50 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
                : 'bg-white/70 border-white/50 shadow-[0_8px_32px_rgba(15,23,42,0.06)]'
            }`}
          >
            {/* Inner background glow */}
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-gradient-to-tr from-indigo-200/20 to-purple-200/20 rounded-full blur-xl" />
            
            {/* Avatar frame */}
            <div className={`w-24 h-24 rounded-full border-4 ${activeTheme.id === 'neon_cyber' ? 'border-slate-800 shadow-[0_8px_20px_rgba(0,0,0,0.4)]' : 'border-white shadow-[0_8px_20px_rgba(0,0,0,0.08)]'} mb-4 flex items-center justify-center overflow-hidden shrink-0 bg-slate-100 relative z-10 transition-transform duration-500 hover:scale-105`}>
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
            <h1 className={`text-xl font-extrabold text-center tracking-tight leading-tight w-full px-2 relative z-10 ${
              activeTheme.id === 'neon_cyber' ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {profileTitle || 'Profil Başlığı'}
            </h1>

            {/* Profile Bio */}
            <p className={`text-xs text-center mt-2.5 leading-relaxed max-w-xs px-2 break-words relative z-10 ${
              activeTheme.id === 'neon_cyber' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {profileBio || 'Biyografi bilgisi girilmedi.'}
            </p>
          </motion.div>

          {/* Links List */}
          <div className="w-full space-y-4 flex-1 z-10">
            {links.map((link) => {
              const colorStyle = getLinkColorStyles(link.colorTheme);
              return (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  variants={linkVariants}
                  whileHover={{ scale: 1.018, y: -1.5, shadow: "0px 10px 20px rgba(0, 0, 0, 0.08)" }}
                  whileTap={{ scale: 0.995 }}
                  onClick={(e) => {
                    if (link.actionType === 'leadForm' || link.url === '#lead-form') {
                      e.preventDefault();
                      setIsLeadModalOpen(true);
                    } else if (link.actionType === 'weeklyMenu' || link.url === '#weekly-menu') {
                      e.preventDefault();
                      setIsMenuModalOpen(true);
                    }
                    try {
                      fetch(`/api/track-click/${currentProfileId}/${link.id}`, { method: 'POST' }).catch(() => {});
                      import('@vercel/analytics').then(({ track }) => {
                        track('Link Click', {
                          profile: currentProfileId,
                          linkTitle: link.title,
                          url: link.url
                        });
                      }).catch(() => {});
                    } catch(err){}
                  }}
                  className={`w-full p-4 border rounded-[22px] flex items-center gap-3.5 transition-all duration-300 ${colorStyle.bg} shadow-sm`}
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
                </motion.a>
              );
            })}

            {links.length === 0 && (
              <motion.div 
                variants={linkVariants}
                className="text-center py-12 text-slate-400 text-xs"
              >
                Bağlantı bulunmamaktadır.
              </motion.div>
            )}
          </div>

          {/* Social Icons */}
          <motion.div 
            variants={socialVariants}
            className="flex items-center justify-center gap-5 mt-10 pt-6 border-t border-slate-200/40 w-full z-10"
          >
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
          </motion.div>

          {/* Fine credit line */}
          <div className="mt-10 text-[10px] text-slate-400 font-bold tracking-wider uppercase z-10">
            Powered by Ankara Çocuk Etkinlikler
          </div>

          {/* Institutional Enterprise SaaS Modals for Public View */}
          <LeadCaptureModal
            isOpen={isLeadModalOpen}
            onClose={() => setIsLeadModalOpen(false)}
            institutionTitle={profileTitle}
            whatsappNotifyNumber={whatsappNotifyNumber}
            onSubmitLead={async (lead) => {
              const newLead: ParentLead = {
                ...lead,
                id: 'lead_' + Date.now(),
                createdAt: new Date().toISOString(),
                status: 'new'
              };
              setParentLeads(prev => [newLead, ...prev]);
              try {
                await fetch(`/api/lead/${currentProfileId}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(lead)
                });
              } catch(err) {
                console.error('Lead record error:', err);
              }
            }}
          />

          <WeeklyMenuModal
            isOpen={isMenuModalOpen}
            onClose={() => setIsMenuModalOpen(false)}
            institutionTitle={profileTitle}
            menuUrl={weeklyMenuUrl}
            menuTitle={weeklyMenuTitle}
          />
        </motion.div>
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

        {/* Profile Switcher & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5 shadow-xs mr-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aktif Profil:</span>
            <select
              value={currentProfileId}
              onChange={(e) => handleSwitchProfile(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-slate-800 outline-none cursor-pointer focus:ring-0 py-0 pr-6 pl-0"
            >
              {profilesList.map(profile => (
                <option key={profile.id} value={profile.id}>
                  {profile.title}
                </option>
              ))}
            </select>
            
            <span className="w-[1px] h-4 bg-slate-200" />
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100/50 rounded-lg transition cursor-pointer"
              title="Yeni Profil Ekle"
            >
              <Plus size={15} />
            </button>
            <button
              onClick={handleOpenRenameModal}
              className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100/50 rounded-lg transition cursor-pointer"
              title="Profili Yeniden Adlandır"
            >
              <Edit3 size={15} />
            </button>
            {currentProfileId !== 'ankara-cocuk-rehberi' && (
              <button
                onClick={handleDeleteProfile}
                className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100/50 rounded-lg transition cursor-pointer"
                title="Profili Sil"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>

          {/* Institutional SaaS Quick Actions */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsPresetModalOpen(true);
            }}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
          >
            <Sparkles size={14} /> Hazır Şablonlar
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLeadsModalOpen(true);
            }}
            className="relative px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Users size={14} /> Veli Talepleri
            {parentLeads.length > 0 && (
              <span className="bg-indigo-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {parentLeads.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLoginModalOpen(true);
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <ShieldCheck size={14} /> Okul Girişi
          </button>

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

        </div>
      </header>

      {/* --- MAIN WORKSPACE WORKFLOW --- */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT PANEL: Editing, Profile, Appearance & Lists Controls */}
        <aside className="w-[360px] h-full bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 shadow-sm">
          
          {/* Navigation Subtabs inside Sidebar */}
          <div className="grid grid-cols-2 border-b border-slate-150 p-2 gap-1 bg-slate-50">
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
              <Palette size={14} /> Tasarım
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
                
                {/* Institutional Quick Actions Banner */}
                <div className="bg-slate-900 p-4 rounded-2xl text-white space-y-3 shadow-md border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Kurumsal Okul Paneli</span>
                    <span className="text-[9px] bg-indigo-500/20 px-2 py-0.5 rounded-full text-indigo-300 border border-indigo-500/30 font-mono">SaaS v2.0</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPresetModalOpen(true)}
                      className="py-2 px-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                    >
                      <Sparkles size={13} /> Şablon Yükle
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsLeadsModalOpen(true)}
                      className="py-2 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                    >
                      <Users size={13} /> Veli Talepleri ({parentLeads.length})
                    </button>
                  </div>
                </div>

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

                  {/* Profile bio */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-sm space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 block">Biyografi Açıklaması</span>
                    <textarea 
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none h-16 resize-none text-slate-700 leading-normal"
                      placeholder="Ankara'daki en renkli çocuk etkinlikleri, atölyeler ve aile rehberi."
                    />
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
                          <option value="play">Google Play ▶️</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block mb-1">Kart Rengi</span>
                        <select
                          value={newColorTheme}
                          onChange={(e: any) => setNewColorTheme(e.target.value)}
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 outline-none"
                        >
                          <option value="white">Saf Beyaz ⚪</option>
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
                                    <option value="play">Google Play ▶️</option>
                                  </select>
                                </div>

                                <div>
                                  <span className="text-[9px] font-bold text-slate-400 block mb-0.5">Kart Rengi</span>
                                  <select
                                    value={editingLinkData.colorTheme}
                                    onChange={(e: any) => setEditingLinkData(prev => prev ? { ...prev, colorTheme: e.target.value } : null)}
                                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 outline-none"
                                  >
                                    <option value="white">Saf Beyaz ⚪</option>
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
          </div>
        </aside>

        {/* MIDDLE PANEL: Elegant Mobile Mock Showcase with custom theme elements */}
        <main className="flex-1 bg-[#f1f5f9] flex flex-col relative overflow-hidden">
          
          {/* Header toolbar for mock preview actions */}
          <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-slate-100 rounded-full text-[11px] font-semibold text-slate-500 font-mono border border-slate-200/50">
                {getPublicUrl()}
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
                <div className="relative z-10 flex-1 flex flex-col items-center px-4 pt-12 pb-12 w-full">
                  {/* Glowing blur blobs behind the profile card for depth */}
                  <div className="absolute top-10 left-6 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none z-0" />
                  <div className="absolute top-28 right-6 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl pointer-events-none z-0" />
                  
                  {/* Profile Header Card (Glassmorphism) */}
                  <div className={`w-full p-4 rounded-[22px] flex flex-col items-center mb-6 relative overflow-hidden z-10 backdrop-blur-md border ${
                    activeTheme.id === 'neon_cyber'
                      ? 'bg-slate-950/50 border-slate-800/80 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
                      : 'bg-white/70 border-white/50 shadow-[0_8px_32px_rgba(15,23,42,0.06)]'
                  }`}>
                    {/* Inner background glow */}
                    <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-tr from-indigo-200/20 to-purple-200/20 rounded-full blur-xl" />
                    
                    {/* Avatar frame */}
                    <div className={`w-18 h-18 rounded-full border-4 ${activeTheme.id === 'neon_cyber' ? 'border-slate-800 shadow-[0_8px_20px_rgba(0,0,0,0.4)]' : 'border-white shadow-[0_8px_20px_rgba(0,0,0,0.08)]'} mb-3 flex items-center justify-center overflow-hidden shrink-0 bg-slate-100 relative z-10 transition-transform duration-500 hover:scale-105`}>
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

                    {/* Profile texts with dynamic styling mapping */}
                    <h1 className={`text-md font-extrabold text-center tracking-tight leading-tight w-full truncate px-2 relative z-10 ${
                      activeTheme.id === 'neon_cyber' ? 'text-slate-100' : 'text-slate-800'
                    }`}>
                      {profileTitle || 'Profil Başlığı'}
                    </h1>

                    <p className={`text-[10px] text-center mt-1.5 leading-relaxed max-w-[200px] px-2 break-words relative z-10 ${
                      activeTheme.id === 'neon_cyber' ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {profileBio || 'Biyografi bilgisi girilmedi.'}
                    </p>
                  </div>

                  {/* Links Loop with interactive click simulator triggers */}
                  <div className="w-full space-y-3 flex-1 z-10">
                    {links.map((link) => {
                      const colorStyle = getLinkColorStyles(link.colorTheme);
                      return (
                        <motion.div
                          key={link.id}
                          whileHover={{ scale: 1.015, y: -1 }}
                          whileTap={{ scale: 0.995 }}
                          onClick={() => handleSimulateClick(link.id)}
                          className={`w-full p-3.5 border rounded-[22px] cursor-pointer flex items-center gap-3 transition-all duration-300 ${colorStyle.bg} shadow-sm`}
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
                  <div className="mt-8 text-[9px] text-slate-400 font-bold tracking-wider uppercase z-10">
                    Powered by Ankara Çocuk Etkinlikler
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
                    {getPublicUrl()}
                  </span>
                  <button 
                    onClick={handleCopyProfileUrl}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-extrabold transition shrink-0 shadow-sm cursor-pointer"
                  >
                    {isCopied ? 'Kopyalandı!' : 'Kopyala'}
                  </button>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => setIsShareModalOpen(false)}
                    className="w-full py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Profile Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Yeni Profil Oluştur</h3>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setNewProfileTitle('');
                    setCloneSourceProfile('');
                  }}
                  className="text-slate-400 hover:text-slate-655 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleCreateProfile} className="flex flex-col gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase">Profil Başlığı</label>
                  <input
                    type="text"
                    value={newProfileTitle}
                    onChange={(e) => setNewProfileTitle(e.target.value)}
                    placeholder="Örn: Ankarada Ne Yaşıyor"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase">Klonlanacak Profil (İsteğe Bağlı)</label>
                  <select
                    value={cloneSourceProfile}
                    onChange={(e) => setCloneSourceProfile(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none bg-white text-slate-700"
                  >
                    <option value="">-- Boş Şablon (Yeni) --</option>
                    {profilesList.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isSaving || !newProfileTitle.trim()}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold transition hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSaving ? <RefreshCw size={13} className="animate-spin" /> : <Plus size={14} />}
                  Oluştur
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rename Profile Modal */}
      <AnimatePresence>
        {isRenameModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Profili Yeniden Adlandır</h3>
                <button
                  onClick={() => setIsRenameModalOpen(false)}
                  className="text-slate-400 hover:text-slate-650 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              
              <form onSubmit={handleRenameProfile} className="flex flex-col gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase">Profil Başlığı (Görünen İsim)</label>
                  <input
                    type="text"
                    value={renameProfileTitle}
                    onChange={(e) => setRenameProfileTitle(e.target.value)}
                    placeholder="Örn: Ankara Çocuk Rehberi Yeni"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                    autoFocus
                  />
                </div>
                
                {currentProfileId !== 'ankara-cocuk-rehberi' ? (
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase">Profil Linki / ID (URL Slug)</label>
                    <input
                      type="text"
                      value={renameProfileSlug}
                      onChange={(e) => setRenameProfileSlug(e.target.value)}
                      placeholder="ankara-cocuk-rehberi-yeni"
                      className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none font-mono"
                    />
                    <span className="text-[10px] text-amber-500 font-bold mt-1 block">
                      ⚠️ Uyarı: Link kimliğini değiştirmek, daha önce paylaştığınız linkleri geçersiz kılar!
                    </span>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-[11px] text-slate-500 leading-normal">
                    💡 Varsayılan profilin URL link kimliği (`ankara-cocuk-rehberi`) değiştirilemez, ancak görünen başlığını dilediğiniz gibi değiştirebilirsiniz.
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSaving || !renameProfileTitle.trim() || !renameProfileSlug.trim()}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold transition hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSaving ? <RefreshCw size={13} className="animate-spin" /> : <Check size={14} />}
                  Değişiklikleri Kaydet
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Institutional Enterprise SaaS Modals */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        institutionTitle={profileTitle}
        whatsappNotifyNumber={whatsappNotifyNumber}
        onSubmitLead={async (lead) => {
          const newLead: ParentLead = {
            ...lead,
            id: 'lead_' + Date.now(),
            createdAt: new Date().toISOString(),
            status: 'new'
          };
          setParentLeads(prev => [newLead, ...prev]);
          try {
            await fetch(`/api/lead/${currentProfileId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(lead)
            });
          } catch(err) {
            console.error('Lead record error:', err);
          }
        }}
      />

      <WeeklyMenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        institutionTitle={profileTitle}
        menuUrl={weeklyMenuUrl}
        menuTitle={weeklyMenuTitle}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        profilesList={profilesList}
        onLoginSuccess={(role, profileId) => {
          setUserRole(role);
          if (profileId) {
            handleSwitchProfile(profileId);
          }
        }}
      />

      <ParentLeadsModal
        isOpen={isLeadsModalOpen}
        onClose={() => setIsLeadsModalOpen(false)}
        institutionTitle={profileTitle}
        leads={parentLeads}
        onUpdateLeadStatus={(leadId, status) => {
          setParentLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
        }}
      />

      <PresetSelectorModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSelectPreset={(preset) => {
          setProfileTitle(preset.name.replace(/^[^\s]+\s/, ''));
          setProfileBio(preset.defaultBio);
          setActiveThemeId(preset.suggestedTheme);
          const newLinksList = preset.suggestedLinks.map((lnk, idx) => ({
            ...lnk,
            id: `link-preset-${Date.now()}-${idx}`,
            clicks: 0
          }));
          setLinks(newLinksList);
        }}
      />

    </div>
  );
}
