import React, { createContext, useContext, useState, useCallback } from 'react';
import { WindowState } from '@/types/window';

interface Desktop {
  id: string;
  name: string;
  wallpaper?: string;
  windows: string[];
}

interface DesktopContextType {
  desktops: Desktop[];
  currentDesktopId: string;
  createDesktop: (name?: string) => void;
  deleteDesktop: (id: string) => void;
  switchDesktop: (id: string) => void;
  renameDesktop: (id: string, name: string) => void;
  moveWindowToDesktop: (windowId: string, desktopId: string) => void;
  getCurrentDesktopWindows: (allWindows: WindowState[]) => WindowState[];
  addWindowToCurrentDesktop: (windowId: string) => void;
  removeWindowFromDesktops: (windowId: string) => void;
}

const DesktopContext = createContext<DesktopContextType | undefined>(undefined);

export const useDesktops = () => {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useDesktops must be used within DesktopProvider');
  }
  return context;
};

export const DesktopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [desktops, setDesktops] = useState<Desktop[]>([
    { id: 'desktop-1', name: 'Desktop 1', windows: [] },
  ]);
  const [currentDesktopId, setCurrentDesktopId] = useState('desktop-1');

  const addWindowToCurrentDesktop = useCallback((windowId: string) => {
    setDesktops((prev) =>
      prev.map((desktop) => {
        if (desktop.id === currentDesktopId && !desktop.windows.includes(windowId)) {
          return { ...desktop, windows: [...desktop.windows, windowId] };
        }
        return desktop;
      })
    );
  }, [currentDesktopId]);

  const removeWindowFromDesktops = useCallback((windowId: string) => {
    setDesktops((prev) =>
      prev.map((desktop) => ({
        ...desktop,
        windows: desktop.windows.filter((id) => id !== windowId),
      }))
    );
  }, []);

  const createDesktop = useCallback((name?: string) => {
    const newDesktop: Desktop = {
      id: `desktop-${Date.now()}`,
      name: name || `Desktop ${desktops.length + 1}`,
      windows: [],
    };
    setDesktops((prev) => [...prev, newDesktop]);
  }, [desktops.length]);

  const deleteDesktop = useCallback((id: string) => {
    setDesktops((prev) => {
      const filtered = prev.filter((d) => d.id !== id);
      if (filtered.length === 0) {
        return [{ id: 'desktop-1', name: 'Desktop 1', windows: [] }];
      }
      return filtered;
    });

    if (currentDesktopId === id) {
      setCurrentDesktopId(desktops[0].id);
    }
  }, [currentDesktopId, desktops]);

  const switchDesktop = useCallback((id: string) => {
    setCurrentDesktopId(id);
  }, []);

  const renameDesktop = useCallback((id: string, name: string) => {
    setDesktops((prev) =>
      prev.map((desktop) => (desktop.id === id ? { ...desktop, name } : desktop))
    );
  }, []);

  const moveWindowToDesktop = useCallback((windowId: string, desktopId: string) => {
    setDesktops((prev) =>
      prev.map((desktop) => {
        if (desktop.id === desktopId) {
          return { ...desktop, windows: [...desktop.windows, windowId] };
        }
        return { ...desktop, windows: desktop.windows.filter((id) => id !== windowId) };
      })
    );
  }, []);

  const getCurrentDesktopWindows = useCallback(
    (allWindows: WindowState[]) => {
      const currentDesktop = desktops.find((d) => d.id === currentDesktopId);
      if (!currentDesktop) return allWindows;

      if (currentDesktop.windows.length === 0) return [];

      return allWindows.filter((w) => currentDesktop.windows.includes(w.id));
    },
    [desktops, currentDesktopId]
  );

  return (
    <DesktopContext.Provider
      value={{
        desktops,
        currentDesktopId,
        createDesktop,
        deleteDesktop,
        switchDesktop,
        renameDesktop,
        moveWindowToDesktop,
        getCurrentDesktopWindows,
        addWindowToCurrentDesktop,
        removeWindowFromDesktops,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
};
