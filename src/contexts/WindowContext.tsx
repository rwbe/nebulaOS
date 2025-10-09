import React, { createContext, useContext, useState, useCallback } from 'react';
import { WindowState, AppDefinition } from '@/types/window';

interface WindowContextType {
  windows: WindowState[];
  openWindow: (app: AppDefinition) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const useWindows = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindows must be used within WindowProvider');
  }
  return context;
};

export const WindowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);

  const openWindow = useCallback((app: AppDefinition) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === app.id);
      if (existing) {
        return prev.map(w => 
          w.id === app.id 
            ? { ...w, isMinimized: false, isActive: true, zIndex: nextZIndex }
            : { ...w, isActive: false }
        );
      }

      const newWindow: WindowState = {
        id: app.id,
        title: app.name,
        icon: app.icon,
        component: app.component,
        isMinimized: false,
        isMaximized: false,
        isActive: true,
        position: { 
          x: 100 + (prev.length * 30), 
          y: 100 + (prev.length * 30) 
        },
        size: { width: 800, height: 600 },
        zIndex: nextZIndex,
      };

      setNextZIndex(n => n + 1);
      return [...prev.map(w => ({ ...w, isActive: false })), newWindow];
    });
  }, [nextZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => {
      const window = prev.find(w => w.id === id);
      if (!window) return prev;
      
      return prev.map(w => ({
        ...w,
        isActive: w.id === id,
        zIndex: w.id === id ? nextZIndex : w.zIndex,
        isMinimized: w.id === id ? false : w.isMinimized,
      }));
    });
    setNextZIndex(n => n + 1);
  }, [nextZIndex]);

  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, position } : w
    ));
  }, []);

  const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, size } : w
    ));
  }, []);

  return (
    <WindowContext.Provider value={{
      windows,
      openWindow,
      closeWindow,
      minimizeWindow,
      maximizeWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
    }}>
      {children}
    </WindowContext.Provider>
  );
};
