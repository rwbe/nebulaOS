import { useState, useRef, useEffect } from 'react';
import { Minus, Square, X } from 'lucide-react';
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
      className={`fixed glass-strong rounded-xl shadow-window overflow-hidden flex flex-col animate-scale-in ${
        window.isActive ? 'ring-2 ring-primary/20' : ''
      }`}
      style={{
        ...style,
        zIndex: window.zIndex,
      }}
      onMouseDown={() => focusWindow(window.id)}
    >
      {/* Title Bar */}
      <div
        className="window-titlebar h-10 bg-[hsl(var(--window-titlebar))] border-b border-border flex items-center justify-between px-4 cursor-move"
        onMouseDown={handleMouseDown}
        onDoubleClick={() => maximizeWindow(window.id)}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">📱</span>
          <span className="text-sm font-medium">{window.title}</span>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => minimizeWindow(window.id)}
            className="titlebar-btn"
            aria-label="Minimizar"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => maximizeWindow(window.id)}
            className="titlebar-btn"
            aria-label="Maximizar"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => closeWindow(window.id)}
            className="titlebar-btn close"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[hsl(var(--window-bg))] overflow-auto">
        {children}
      </div>
    </div>
  );
};
