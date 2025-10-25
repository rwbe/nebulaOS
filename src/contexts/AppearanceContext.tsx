import React, { createContext, useContext, useEffect, useState } from 'react';

export type WallpaperType = 'gradient' | 'image' | 'video' | 'animated';

interface Wallpaper {
  id: string;
  title: string;
  author: string;
  url: string;
  thumbnail: string;
  palette: string[];
  tags: string[];
  type: WallpaperType;
  videoUrl?: string;
}

interface AppearanceContextType {
  wallpaper: Wallpaper;
  setWallpaper: (wallpaper: Wallpaper) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  wallpapers: Wallpaper[];
}

const defaultWallpapers: Wallpaper[] = [
  {
    id: 'default-light',
    title: 'NebulaOS Light',
    author: 'Microsoft',
    type: 'gradient',
    url: 'data:image/svg+xml,%3Csvg width="3840" height="2160" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(59,130,246);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(139,92,246);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="3840" height="2160" fill="url(%23grad1)"/%3E%3Cpath d="M1920 980 L2100 980 L2100 1160 L1920 1160 Z M1920 1000 L2080 1000 L2080 1140 L1920 1140 Z M1940 1020 L1940 1120 L2060 1120 L2060 1020 Z M1960 1040 L1960 1100 L2040 1100 L2040 1040 Z" fill="white" fill-opacity="0.9"/%3E%3C/svg%3E',
    thumbnail: 'data:image/svg+xml,%3Csvg width="320" height="180" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(59,130,246);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(139,92,246);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="320" height="180" fill="url(%23grad1)"/%3E%3C/svg%3E',
    palette: ['#3B82F6', '#8B5CF6', '#FFFFFF'],
    tags: ['default', 'windows', 'light'],
  },
  {
    id: 'default-dark',
    title: 'NebulaOS Dark',
    author: 'Microsoft',
    type: 'gradient' as const,
    url: 'data:image/svg+xml,%3Csvg width="3840" height="2160" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(17,24,39);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(30,41,59);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="3840" height="2160" fill="url(%23grad1)"/%3E%3Cpath d="M1920 980 L2100 980 L2100 1160 L1920 1160 Z M1920 1000 L2080 1000 L2080 1140 L1920 1140 Z M1940 1020 L1940 1120 L2060 1120 L2060 1020 Z M1960 1040 L1960 1100 L2040 1100 L2040 1040 Z" fill="white" fill-opacity="0.9"/%3E%3C/svg%3E',
    thumbnail: 'data:image/svg+xml,%3Csvg width="320" height="180" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(17,24,39);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(30,41,59);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="320" height="180" fill="url(%23grad1)"/%3E%3C/svg%3E',
    palette: ['#111827', '#1E293B', '#3B82F6'],
    tags: ['default', 'windows', 'dark'],
  },
  {
    id: 'ocean-blue',
    title: 'Ocean Blue',
    author: 'Design Team',
    type: 'gradient' as const,
    url: 'data:image/svg+xml,%3Csvg width="3840" height="2160" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(14,165,233);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(59,130,246);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="3840" height="2160" fill="url(%23grad1)"/%3E%3C/svg%3E',
    thumbnail: 'data:image/svg+xml,%3Csvg width="320" height="180" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(14,165,233);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(59,130,246);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="320" height="180" fill="url(%23grad1)"/%3E%3C/svg%3E',
    palette: ['#0EA5E9', '#3B82F6', '#1E3A8A'],
    tags: ['blue', 'ocean', 'gradient'],
  },
  {
    id: 'purple-haze',
    title: 'Purple Haze',
    author: 'Design Team',
    type: 'gradient' as const,
    url: 'data:image/svg+xml,%3Csvg width="3840" height="2160" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(139,92,246);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(236,72,153);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="3840" height="2160" fill="url(%23grad1)"/%3E%3C/svg%3E',
    thumbnail: 'data:image/svg+xml,%3Csvg width="320" height="180" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(139,92,246);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(236,72,153);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="320" height="180" fill="url(%23grad1)"/%3E%3C/svg%3E',
    palette: ['#8B5CF6', '#EC4899', '#7C3AED'],
    tags: ['purple', 'pink', 'gradient'],
  },
  {
    id: 'sunset-glow',
    title: 'Sunset Glow',
    author: 'Design Team',
    type: 'gradient' as const,
    url: 'data:image/svg+xml,%3Csvg width="3840" height="2160" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(251,146,60);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(239,68,68);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="3840" height="2160" fill="url(%23grad1)"/%3E%3C/svg%3E',
    thumbnail: 'data:image/svg+xml,%3Csvg width="320" height="180" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(251,146,60);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(239,68,68);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="320" height="180" fill="url(%23grad1)"/%3E%3C/svg%3E',
    palette: ['#FB923C', '#EF4444', '#DC2626'],
    tags: ['orange', 'red', 'sunset'],
  },
  {
    id: 'forest-green',
    title: 'Forest Green',
    author: 'Design Team',
    type: 'gradient' as const,
    url: 'data:image/svg+xml,%3Csvg width="3840" height="2160" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(34,197,94);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(16,185,129);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="3840" height="2160" fill="url(%23grad1)"/%3E%3C/svg%3E',
    thumbnail: 'data:image/svg+xml,%3Csvg width="320" height="180" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(34,197,94);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(16,185,129);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="320" height="180" fill="url(%23grad1)"/%3E%3C/svg%3E',
    palette: ['#22C55E', '#10B981', '#059669'],
    tags: ['green', 'nature', 'forest'],
  },
  {
    id: 'midnight-blue',
    title: 'Midnight Blue',
    author: 'Design Team',
    type: 'gradient' as const,
    url: 'data:image/svg+xml,%3Csvg width="3840" height="2160" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(30,58,138);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(17,24,39);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="3840" height="2160" fill="url(%23grad1)"/%3E%3C/svg%3E',
    thumbnail: 'data:image/svg+xml,%3Csvg width="320" height="180" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(30,58,138);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(17,24,39);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="320" height="180" fill="url(%23grad1)"/%3E%3C/svg%3E',
    palette: ['#1E3A8A', '#111827', '#3B82F6'],
    tags: ['blue', 'dark', 'midnight'],
  },
  {
    id: 'rose-gold',
    title: 'Rose Gold',
    author: 'Design Team',
    type: 'gradient' as const,
    url: 'data:image/svg+xml,%3Csvg width="3840" height="2160" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(244,114,182);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(251,207,232);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="3840" height="2160" fill="url(%23grad1)"/%3E%3C/svg%3E',
    thumbnail: 'data:image/svg+xml,%3Csvg width="320" height="180" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(244,114,182);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(251,207,232);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="320" height="180" fill="url(%23grad1)"/%3E%3C/svg%3E',
    palette: ['#F472B6', '#FBCFE8', '#EC4899'],
    tags: ['pink', 'rose', 'elegant'],
  },
  {
    id: 'cyan-wave',
    title: 'Cyan Wave',
    author: 'Design Team',
    type: 'gradient' as const,
    url: 'data:image/svg+xml,%3Csvg width="3840" height="2160" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(6,182,212);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(59,130,246);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="3840" height="2160" fill="url(%23grad1)"/%3E%3C/svg%3E',
    thumbnail: 'data:image/svg+xml,%3Csvg width="320" height="180" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(6,182,212);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(59,130,246);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="320" height="180" fill="url(%23grad1)"/%3E%3C/svg%3E',
    palette: ['#06B6D4', '#3B82F6', '#0891B2'],
    tags: ['cyan', 'blue', 'wave'],
  },
  {
    id: 'amber-warmth',
    title: 'Amber Warmth',
    author: 'Design Team',
    type: 'gradient' as const,
    url: 'data:image/svg+xml,%3Csvg width="3840" height="2160" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(245,158,11);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(251,146,60);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="3840" height="2160" fill="url(%23grad1)"/%3E%3C/svg%3E',
    thumbnail: 'data:image/svg+xml,%3Csvg width="320" height="180" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(245,158,11);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(251,146,60);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="320" height="180" fill="url(%23grad1)"/%3E%3C/svg%3E',
    palette: ['#F59E0B', '#FB923C', '#D97706'],
    tags: ['amber', 'orange', 'warm'],
  },
  {
    id: 'emerald-forest',
    title: 'Emerald Forest',
    author: 'Design Team',
    type: 'gradient' as const,
    url: 'data:image/svg+xml,%3Csvg width="3840" height="2160" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(5,150,105);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(6,78,59);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="3840" height="2160" fill="url(%23grad1)"/%3E%3C/svg%3E',
    thumbnail: 'data:image/svg+xml,%3Csvg width="320" height="180" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(5,150,105);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(6,78,59);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="320" height="180" fill="url(%23grad1)"/%3E%3C/svg%3E',
    palette: ['#059669', '#064E3B', '#10B981'],
    tags: ['emerald', 'green', 'dark'],
  },
  {
    id: 'violet-dream',
    title: 'Violet Dream',
    author: 'Design Team',
    type: 'gradient' as const,
    url: 'data:image/svg+xml,%3Csvg width="3840" height="2160" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(124,58,237);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(59,130,246);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="3840" height="2160" fill="url(%23grad1)"/%3E%3C/svg%3E',
    thumbnail: 'data:image/svg+xml,%3Csvg width="320" height="180" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(124,58,237);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(59,130,246);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="320" height="180" fill="url(%23grad1)"/%3E%3C/svg%3E',
    palette: ['#7C3AED', '#3B82F6', '#6D28D9'],
    tags: ['violet', 'purple', 'blue'],
  },
  {
    id: 'crimson-night',
    title: 'Crimson Night',
    author: 'Design Team',
    type: 'gradient' as const,
    url: 'data:image/svg+xml,%3Csvg width="3840" height="2160" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(220,38,38);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(127,29,29);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="3840" height="2160" fill="url(%23grad1)"/%3E%3C/svg%3E',
    thumbnail: 'data:image/svg+xml,%3Csvg width="320" height="180" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:rgb(220,38,38);stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:rgb(127,29,29);stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="320" height="180" fill="url(%23grad1)"/%3E%3C/svg%3E',
    palette: ['#DC2626', '#7F1D1D', '#EF4444'],
    tags: ['red', 'crimson', 'dark'],
  },
];

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

export const useAppearance = () => {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error('useAppearance must be used within AppearanceProvider');
  }
  return context;
};

export const AppearanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallpaper, setWallpaperState] = useState<Wallpaper>(() => {
    const saved = localStorage.getItem('nebula-wallpaper');
    return saved ? JSON.parse(saved) : defaultWallpapers[1]; // default-dark
  });

  const [accentColor, setAccentColorState] = useState<string>(() => {
    const saved = localStorage.getItem('nebula-accent-color');
    return saved || '217 100% 50%'; // Default NebulaOS blue
  });

  useEffect(() => {
    localStorage.setItem('nebula-wallpaper', JSON.stringify(wallpaper));
  }, [wallpaper]);

  useEffect(() => {
    localStorage.setItem('nebula-accent-color', accentColor);
    // Apply accent color to CSS variables
    document.documentElement.style.setProperty('--primary', accentColor);
    document.documentElement.style.setProperty('--accent', accentColor);
    document.documentElement.style.setProperty('--ring', accentColor);
    document.documentElement.style.setProperty('--taskbar-active', accentColor);
  }, [accentColor]);

  const setWallpaper = (newWallpaper: Wallpaper) => {
    setWallpaperState(newWallpaper);
  };

  const setAccentColor = (color: string) => {
    setAccentColorState(color);
  };

  return (
    <AppearanceContext.Provider value={{ wallpaper, setWallpaper, accentColor, setAccentColor, wallpapers: defaultWallpapers }}>
      {children}
    </AppearanceContext.Provider>
  );
};
