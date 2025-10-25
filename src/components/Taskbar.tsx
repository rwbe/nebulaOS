import { 
  Clock, Search, Wifi, Volume2, Battery, Bell, LayoutGrid, Globe, Mail, FileText, ShoppingBag, ChevronUp 
} from 'lucide-react';
import { FiSearch } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useWindows } from '@/contexts/WindowContext';
import { TaskbarPreview } from './WindowPreview';
import { AppDefinition } from '@/types/window';
import { CalendarPopover } from './CalendarPopover';
import { motion } from 'framer-motion';

interface TaskbarProps {
  onStartClick: () => void;
  isStartMenuOpen: boolean;
  onQuickSettingsClick: () => void;
  onSearchClick: () => void;
  onNotificationsClick: () => void;
  onTaskViewClick: () => void;
}

const pinnedApps: AppDefinition[] = [
  { id: 'browser', name: 'Navegador', icon: 'globe', component: 'Browser', isPinned: true },
  { id: 'mail', name: 'Email', icon: 'mail', component: 'Mail', isPinned: true },
  { id: 'notepad', name: 'Bloco de Notas', icon: 'file-text', component: 'Notepad', isPinned: true },
  { id: 'store', name: 'Store', icon: 'shopping-bag', component: 'Store', isPinned: true },
];

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    'globe': Globe,
    'mail': Mail,
    'file-text': FileText,
    'shopping-bag': ShoppingBag,
  };
  return iconMap[iconName] || FileText;
};

export const Taskbar = ({
  onStartClick, 
  isStartMenuOpen, 
  onQuickSettingsClick, 
  onSearchClick, 
  onNotificationsClick, 
  onTaskViewClick 
}: TaskbarProps) => {
  const [time, setTime] = useState(new Date());
  const { windows, openWindow, focusWindow, closeWindow } = useWindows();
  const [showCalendar, setShowCalendar] = useState(false);
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [showSystemTray, setShowSystemTray] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAppClick = (app: AppDefinition) => {
    const existingWindow = windows.find(w => w.id === app.id);
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        focusWindow(app.id);
      } else if (existingWindow.isActive) {
        focusWindow(app.id);
      } else {
        focusWindow(app.id);
      }
    } else {
      openWindow(app);
    }
    setHoveredApp(null);
  };

  const handleAppHover = (appId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverPosition({ x: rect.left, y: rect.top });
    setHoveredApp(appId);
  };

  const appWindows = hoveredApp ? windows.filter(w => w.id === hoveredApp) : [];

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-14 glass-ultra z-50 flex items-center justify-center gap-1 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        
        {/* Left Section - Start, Search, Task View */}
        <div className="absolute left-2 flex items-center gap-1">
          
          {/* Start Button */}
          <motion.button
            onClick={onStartClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative flex items-center justify-center w-11 h-11 rounded-xl transition-all ${isStartMenuOpen ? 'bg-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'hover:bg-white/5'}`}
            aria-label="Menu Iniciar"
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isStartMenuOpen ? 'bg-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-gradient-to-br from-primary to-primary/80'}`}>
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-1.5 h-1.5 bg-white rounded-sm" />
                <div className="w-1.5 h-1.5 bg-white rounded-sm" />
                <div className="w-1.5 h-1.5 bg-white rounded-sm" />
                <div className="w-1.5 h-1.5 bg-white rounded-sm" />
              </div>
            </div>
            {isStartMenuOpen && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </motion.button>

          {/* Search */}
          <motion.button 
            onClick={(e) => {
              e.stopPropagation();
              onSearchClick();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 h-11 rounded-xl hover:bg-white/5 transition-all"
            aria-label="Pesquisar"
          >
            <FiSearch className="w-4 h-4" />
            <span className="text-sm text-muted-foreground">Pesquisar</span>
          </motion.button>

          {/* Task View */}
          <motion.button
            onClick={onTaskViewClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-11 h-11 rounded-xl hover:bg-white/5 transition-all"
            aria-label="Visão de Tarefas"
            title="Visão de Tarefas (Win + Tab)"
          >
            <LayoutGrid className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Center Section - Pinned Apps & Running Windows */}
        <div className="flex items-center gap-1 px-2">
          
          {/* Pinned Apps */}
          {pinnedApps.map(app => {
            const isOpen = windows.some(w => w.id === app.id);
            const isActive = windows.some(w => w.id === app.id && w.isActive);
            const IconComponent = getIconComponent(app.icon);
            
            return (
              <motion.button
                key={app.id}
                onClick={() => handleAppClick(app)}
                onMouseEnter={(e) => handleAppHover(app.id, e)}
                onMouseLeave={() => setHoveredApp(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative group flex items-center justify-center w-11 h-11 rounded-xl transition-all ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
                aria-label={app.name}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive ? 'bg-gradient-to-br from-primary/30 to-purple-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-gradient-to-br from-white/5 to-white/10'}`}>
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-foreground/80'}`} />
                </div>
                {isActive && (
                  <motion.div 
                    layoutId={`indicator-${app.id}`}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"
                    style={{ transform: 'translateX(-50%)' }}
                  />
                )}
                {isOpen && !isActive && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary/60 rounded-full" />
                )}
              </motion.button>
            );
          })}

          {/* Other Running Windows */}
          {windows
            .filter(w => !pinnedApps.some(p => p.id === w.id))
            .map(window => (
              <motion.button
                key={window.id}
                onClick={() => focusWindow(window.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative group flex items-center justify-center w-11 h-11 rounded-xl transition-all ${window.isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
                aria-label={window.name}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${window.isActive ? 'bg-gradient-to-br from-primary/30 to-purple-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-gradient-to-br from-white/5 to-white/10'}`}>
                  <FileText className={`w-5 h-5 ${window.isActive ? 'text-primary' : 'text-foreground/80'}`} />
                </div>
                {window.isActive && (
                  <motion.div 
                    layoutId={`indicator-${window.id}`}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"
                    style={{transform: 'translateX(-50%)'
                }}
                  />
                )}
              </motion.button>
            ))}
        </div>

        {/* Right Section - System Tray */}
        <div className="absolute right-2 flex items-center gap-1">
          
          {/* System Tray Toggle */}
          <motion.button
            onClick={() => setShowSystemTray(!showSystemTray)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all ${showSystemTray ? 'bg-white/10' : 'hover:bg-white/5'}`}
            aria-label="Mostrar ícones ocultos"
          >
            <ChevronUp className={`w-4 h-4 transition-transform ${showSystemTray ? 'rotate-180' : ''}`} />
          </motion.button>

          {/* Separator */}
          <div className="w-px h-6 bg-border/50 mx-1" />

          {/* Notifications */}
          <motion.button 
            onClick={onNotificationsClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/5 transition-all"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
          </motion.button>
          
          {/* Quick Settings */}
          <motion.button 
            onClick={onQuickSettingsClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 h-9 rounded-lg hover:bg-white/5 transition-all"
            aria-label="Configurações Rápidas"
          >
            <Wifi className="w-4 h-4" />
            <Volume2 className="w-4 h-4" />
            <Battery className="w-4 h-4" />
          </motion.button>

          {/* Separator */}
          <div className="w-px h-6 bg-border/50 mx-1" />

          {/* Clock & Date */}
          <motion.button 
            onClick={(e) => {
              e.stopPropagation();
              setShowCalendar(!showCalendar);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-4 h-11 rounded-xl hover:bg-white/5 transition-all min-w-[140px]"
          >
            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold">
                {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {time.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
                  .replace('.', '')}
              </span>
            </div>
          </motion.button>
        </div>

        {/* Calendar Popover */}
        {showCalendar && (
          <CalendarPopover onClose={() => setShowCalendar(false)} />
        )}
      </div>

      {/* Aero Peek Preview */}
      {hoveredApp && appWindows.length > 0 && (
        <TaskbarPreview
          windows={appWindows}
          onClose={closeWindow}
          onFocus={focusWindow}
          position={hoverPosition}
        />
      )}
    </>
  );
};
