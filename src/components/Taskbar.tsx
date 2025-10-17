import { Clock, Search, Wifi, Volume2, Battery } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useWindows } from '@/contexts/WindowContext';
import { AppDefinition } from '@/types/window';

interface TaskbarProps {
  onStartClick: () => void;
  isStartMenuOpen: boolean;
  onQuickSettingsClick: () => void;
}

const pinnedApps: AppDefinition[] = [
  { id: 'browser', name: 'Navegador', icon: 'globe', component: 'Browser', isPinned: true },
   { id: 'mail', name: 'Email', icon: 'mail', component: 'Mail', isPinned: true },
   { id: 'notepad', name: 'Bloco de Notas', icon: 'file-text', component: 'Notepad', isPinned: true },
];

export const Taskbar = ({ onStartClick, isStartMenuOpen, onQuickSettingsClick }: TaskbarProps) => {
  const [time, setTime] = useState(new Date());
  const { windows, openWindow, focusWindow } = useWindows();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAppClick = (app: AppDefinition) => {
    const existingWindow = windows.find(w => w.id === app.id);
    if (existingWindow) {
      focusWindow(app.id);
    } else {
      openWindow(app);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 glass-strong shadow-lg z-50 flex items-center px-2 gap-1">
      {/* Start Button */}
      <button
        onClick={onStartClick}
        className={`taskbar-btn flex items-center justify-center ${isStartMenuOpen ? 'active' : ''}`}
        aria-label="Menu Iniciar"
      >
        <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
          <div className="grid grid-cols-2 gap-0.5">
            <div className="w-1.5 h-1.5 bg-white rounded-sm" />
            <div className="w-1.5 h-1.5 bg-white rounded-sm" />
            <div className="w-1.5 h-1.5 bg-white rounded-sm" />
            <div className="w-1.5 h-1.5 bg-white rounded-sm" />
          </div>
        </div>
      </button>

      {/* Search */}
      <button className="taskbar-btn flex items-center gap-2 px-4" aria-label="Pesquisar">
        <Search className="w-4 h-4" />
        <span className="text-sm text-muted-foreground">Pesquisar</span>
      </button>

      {/* Separator */}
      <div className="w-px h-6 bg-border mx-1" />

      {/* Pinned Apps */}
      {pinnedApps.map(app => {
        const isOpen = windows.some(w => w.id === app.id);
        const isActive = windows.some(w => w.id === app.id && w.isActive);
        
        return (
          <button
            key={app.id}
            onClick={() => handleAppClick(app)}
            className={`taskbar-btn ${isActive ? 'active' : ''}`}
            aria-label={app.name}
          >
            <div className="w-5 h-5 bg-muted rounded flex items-center justify-center">
              <span className="text-xs">📄</span>
            </div>
            {isOpen && !isActive && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
            )}
          </button>
        );
      })}

      {/* Spacer */}
      <div className="flex-1" />

      {/* System Tray */}
      <button 
        onClick={onQuickSettingsClick}
        className="flex items-center gap-2 taskbar-btn"
        aria-label="Configurações Rápidas"
      >
        <Wifi className="w-4 h-4" />
        <Volume2 className="w-4 h-4" />
        <Battery className="w-4 h-4" />
      </button>

      {/* Clock */}
      <button className="taskbar-btn px-3 flex flex-col items-center leading-tight">
        <span className="text-xs font-medium">{time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        <span className="text-[10px] text-muted-foreground">{time.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
      </button>
    </div>
  );
};
