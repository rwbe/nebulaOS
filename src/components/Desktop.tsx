import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CustomCursor } from './CustomCursor';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { WallpaperRenderer } from './WallpaperRenderer';
import { WindowManager } from './WindowManager';
import { QuickSettings } from './QuickSettings';
import { SearchPanel } from './SearchPanel';
import { DesktopGrid } from './DesktopGrid';
import { NotificationCenter } from './NotificationCenter';
import { TaskView } from './TaskView';
import { Widgets } from './Widgets';
import { useAppearance } from '@/contexts/AppearanceContext';
import { AnimatePresence } from 'framer-motion';

export const Desktop = () => {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTaskViewOpen, setIsTaskViewOpen] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
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

      {/* Wallpaper Background */}
      <WallpaperRenderer />

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

      {/* Notification Center */}
      {isNotificationsOpen && (
        <NotificationCenter onClose={() => setIsNotificationsOpen(false)} />
      )}

      {/* Task View */}
      <AnimatePresence>
        {isTaskViewOpen && (
          <TaskView onClose={() => setIsTaskViewOpen(false)} />
        )}
      </AnimatePresence>

      {/* Widgets */}
      <Widgets />

      {/* Custom Cursor */}
      {showCursor && <CustomCursor />}

      {/* Taskbar */}
      <Taskbar 
        onStartClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
        isStartMenuOpen={isStartMenuOpen}
        onQuickSettingsClick={() => setIsQuickSettingsOpen(!isQuickSettingsOpen)}
        onSearchClick={() => setIsSearchOpen(true)}
        onNotificationsClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
        onTaskViewClick={() => setIsTaskViewOpen(!isTaskViewOpen)}
      />
    </div>
  );
};
