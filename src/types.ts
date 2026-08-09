export interface LinkItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  iconType: 'web' | 'whatsapp' | 'instagram' | 'youtube' | 'store' | 'tiktok' | 'twitter' | 'discord' | 'telegram' | 'play' | 'menu' | 'calendar' | 'form' | 'phone' | 'map';
  colorTheme: 'blue' | 'emerald' | 'amber' | 'rose' | 'violet' | 'indigo' | 'slate' | 'white';
  clicks: number;
  badgeText?: string;
  actionType?: 'url' | 'leadForm' | 'weeklyMenu' | 'branchModal';
}

export interface ParentLead {
  id: string;
  parentName: string;
  phone: string;
  childAgeOrGrade: string;
  programInterest?: string;
  note?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'registered';
}

export interface BranchLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  googleMapsUrl?: string;
}

export interface ProfileData {
  id: string;
  title: string;
  bio: string;
  avatarUrl: string;
  badgeText: string;
  isVerified: boolean;
  themeId: string;
  institutionType?: 'anaokulu' | 'kolej' | 'atolye' | 'genel';
  adminEmail?: string;
  adminPasswordHash?: string;
  whatsappNotifyNumber?: string;
  weeklyMenuUrl?: string;
  weeklyMenuTitle?: string;
  branches?: BranchLocation[];
  links: LinkItem[];
  leads?: ParentLead[];
  socials?: {
    instagram?: string;
    whatsapp?: string;
    youtube?: string;
    website?: string;
    maps?: string;
    phone?: string;
  };
}

export interface InstitutionalPreset {
  id: 'anaokulu' | 'kolej' | 'atolye';
  name: string;
  description: string;
  badgeText: string;
  suggestedTheme: string;
  defaultBio: string;
  suggestedLinks: Omit<LinkItem, 'id' | 'clicks'>[];
}
