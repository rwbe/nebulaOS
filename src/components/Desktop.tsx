import { useState } from 'react';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { WindowManager } from './WindowManager';
import { QuickSettings } from './QuickSettings';
import { SearchPanel } from './SearchPanel';
import { DesktopGrid } from './DesktopGrid';
import { useAppearance } from '@/contexts/AppearanceContext';

export const Desktop = () => {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { wallpaper } = useAppearance();

  return (
    <div 
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundImage: `url("${wallpaper.url}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Desktop Icons Area */}
      <div className="absolute inset-0 p-4">
        {/* Future: Desktop icons will go here */}
      </div>

       {/* Desktop Icons Grid */}
      <DesktopGrid />

      {/* NebulaOS*/}
      <WindowManager />

      {/* Start Menu */}
      {isStartMenuOpen && (
        <StartMenu onClose={() => setIsStartMenuOpen(false)} />
      )}

      {/* Quick Settings */}
      {isQuickSettingsOpen && (
        <QuickSettings onClose={() => setIsQuickSettingsOpen(false)} />
      )}

       {/* Search Panel */}
      {isSearchOpen && (
        <SearchPanel onClose={() => setIsSearchOpen(false)} />
      )}

      {/* Taskbar */}
      <Taskbar 
        onStartClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
        isStartMenuOpen={isStartMenuOpen}
        onQuickSettingsClick={() => setIsQuickSettingsOpen(!isQuickSettingsOpen)}
        onSearchClick={() => setIsSearchOpen(true)}
      />
    </div>
  );
};
