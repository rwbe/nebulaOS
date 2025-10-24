import React, { createContext, useContext, useState, useCallback } from 'react';
import { WindowState, AppDefinition } from '@/types/window';

interface WindowContextType {
  windows: WindowState[];
  openWindow: (app: AppDefinition, desktopId?: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  registerWindowOpen: (callback: (windowId: string) => void) => () => void;
  registerWindowClose: (callback: (windowId: string) => void) => () => void;
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
  const [onWindowOpenCallbacks, setOnWindowOpenCallbacks] = useState<((windowId: string) => void)[]>([]);
  const [onWindowCloseCallbacks, setOnWindowCloseCallbacks] = useState<((windowId: string) => void)[]>([]);

  const registerWindowOpen = useCallback((callback: (windowId: string) => void) => {
    setOnWindowOpenCallbacks(prev => [...prev, callback]);
    return () => {
      setOnWindowOpenCallbacks(prev => prev.filter(cb => cb !== callback));
    };
  }, []);

  const registerWindowClose = useCallback((callback: (windowId: string) => void) => {
    setOnWindowCloseCallbacks(prev => [...prev, callback]);
    return () => {
      setOnWindowCloseCallbacks(prev => prev.filter(cb => cb !== callback));
    };
  }, []);

  const openWindow = useCallback((app: AppDefinition, desktopId?: string) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === app.id);
      if (existing) {
        return prev.map(w => 
          w.id === app.id 
            ? { ...w, isMinimized: false, isActive: true, zIndex: nextZIndex }
            : { ...w, isActive: false }
        );
      }

      const appsToMaximize = [
        'Browser', 'FileManager' ,'VSCode', 'Paint', 'Photos', 
        'Music', 'Settings', 'Mail', 'Store', 
        'Paint', 'Screenshot', 'Clock', 'Notepad'
      ];
      
      const shouldMaximize = appsToMaximize.includes(app.component);

      const newWindow: WindowState = {
        id: app.id,
        title: app.name,
        icon: app.icon,
        component: app.component,
        isMinimized: false,
        isMaximized: shouldMaximize,
        isActive: true,
        position: { 
          x: 100 + (prev.length * 30), 
          y: 100 + (prev.length * 30) 
        },
        size: { width: 800, height: 600 },
        zIndex: nextZIndex,
      };

      setNextZIndex(n => n + 1);
      
      onWindowOpenCallbacks.forEach(cb => cb(app.id));
      
      return [...prev.map(w => ({ ...w, isActive: false })), newWindow];
    });
  }, [nextZIndex, onWindowOpenCallbacks]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    onWindowCloseCallbacks.forEach(cb => cb(id));
  }, [onWindowCloseCallbacks]);

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
      registerWindowOpen,
      registerWindowClose,
    }}>
      {children}
    </WindowContext.Provider>
  );
};
