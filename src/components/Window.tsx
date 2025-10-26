import { useState, useRef, useEffect } from 'react';
import { Minus, Square, X, Globe, Folder, Terminal, Activity, Camera, Video, Mic, Paintbrush, Clock, Clipboard, StickyNote, Calculator, Calendar, Mail, Music, Image, Code, FileText, ShoppingBag, Settings, AppWindow } from 'lucide-react';
import { useWindows } from '@/contexts/WindowContext';
import { WindowState } from '@/types/window';

interface WindowProps {
  window: WindowState;
  children: React.ReactNode;
}

export const Window = ({ window, children }: WindowProps) => {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition, updateWindowSize } = useWindows();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      'globe': Globe, 'folder': Folder, 'terminal': Terminal, 'activity': Activity,
      'camera': Camera, 'video': Video, 'mic': Mic, 'paintbrush': Paintbrush,
      'clock': Clock, 'clipboard': Clipboard, 'sticky-note': StickyNote,
      'calculator': Calculator, 'calendar': Calendar, 'mail': Mail,
      'music': Music, 'image': Image, 'code': Code, 'file-text': FileText,
      'shopping-bag': ShoppingBag, 'settings': Settings,
    };
    return iconMap[iconName] || AppWindow;
  };

  const IconComponent = getIconComponent(window.icon || 'app-window');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !window.isMaximized) {
        updateWindowPosition(window.id, {
          x: e.clientX - dragOffset.x,
          y: Math.max(0, e.clientY - dragOffset.y),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, window.id, window.isMaximized, updateWindowPosition]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('window-titlebar')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y,
      });
      focusWindow(window.id);
    }
  };

  if (window.isMinimized) return null;

  const style = window.isMaximized
    ? { left: 0, top: 0, right: 0, bottom: 48, width: '100%', height: 'calc(100% - 48px)' }
    : {
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
      };

  return (
    <div
      ref={windowRef}
      className={`fixed glass-ultra rounded-xl overflow-hidden flex flex-col transition-all duration-200 ${
        window.isActive ? 'ring-1 ring-primary/30 shadow-[0_0_60px_rgba(59,130,246,0.2)]' : 'shadow-[0_20_60px_rgba(0,0,0,0.5)]'
      }`}
      style={{
        ...style,
        zIndex: window.zIndex,
        animation: 'scaleIn 0.2s ease-out',
      }}
      onMouseDown={() => focusWindow(window.id)}
    >
      {/* Title Bar */}
      <div
        className={`h-10 flex items-center justify-between px-4 cursor-move border-b transition-colors ${
          window.isActive ? 'border-primary/20 bg-gradient-to-r from-primary/5 to-transparent' : 'border-border/50'
        }`}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => maximizeWindow(window.id)}
      >
        <div className="flex items-center gap-2.5">
          <div className={`p-1 rounded-lg ${window.isActive ? 'bg-primary/10' : 'bg-muted/30'}`}>
            <IconComponent className={`w-3.5 h-3.5 ${window.isActive ? 'text-primary' : 'text-foreground/70'}`} />
          </div>
          <span className="text-sm font-medium tracking-wide">{window.title}</span>
        </div>
        <div className="flex items-center -mr-2">
          <button
            onClick={() => minimizeWindow(window.id)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors"
            aria-label="Minimizar"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => maximizeWindow(window.id)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors"
            aria-label="Maximizar"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => closeWindow(window.id)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-destructive/20 active:bg-destructive/30 hover:text-destructive transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[hsl(var(--window-bg))] overflow-auto custom-scrollbar">
        {children}
      </div>
    </div>
  );
};
