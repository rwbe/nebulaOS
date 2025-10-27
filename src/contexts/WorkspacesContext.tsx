import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Workspace {
  id: string;
  name: string;
  windows: string[]; // IDs das janelas neste workspace
  wallpaper?: string;
  icon: string;
}

interface WorkspacesContextType {
  workspaces: Workspace[];
  currentWorkspace: string;
  switchToWorkspace: (id: string) => void;
  createWorkspace: (name: string) => void;
  deleteWorkspace: (id: string) => void;
  renameWorkspace: (id: string, name: string) => void;
  moveWindowToWorkspace: (windowId: string, workspaceId: string) => void;
  addWindowToCurrentWorkspace: (windowId: string) => void;
  removeWindowFromWorkspace: (windowId: string, workspaceId: string) => void;
}

const WorkspacesContext = createContext<WorkspacesContextType | undefined>(undefined);

export const useWorkspaces = () => {
  const context = useContext(WorkspacesContext);
  if (!context) {
    throw new Error('useWorkspaces must be used within a WorkspacesProvider');
  }
  return context;
};

export const WorkspacesProvider = ({ children }: { children: ReactNode }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: 'workspace-1', name: 'Principal', windows: [], icon: 'home' },
    { id: 'workspace-2', name: 'Trabalho', windows: [], icon: 'briefcase' },
    { id: 'workspace-3', name: 'Criativo', windows: [], icon: 'palette' },
  ]);

  const [currentWorkspace, setCurrentWorkspace] = useState('workspace-1');

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        const index = parseInt(e.key);
        if (index >= 1 && index <= workspaces.length) {
          switchToWorkspace(workspaces[index - 1].id);
        } else if (e.key === 'ArrowRight') {
          const currentIndex = workspaces.findIndex(w => w.id === currentWorkspace);
          const nextIndex = (currentIndex + 1) % workspaces.length;
          switchToWorkspace(workspaces[nextIndex].id);
        } else if (e.key === 'ArrowLeft') {
          const currentIndex = workspaces.findIndex(w => w.id === currentWorkspace);
          const prevIndex = (currentIndex - 1 + workspaces.length) % workspaces.length;
          switchToWorkspace(workspaces[prevIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentWorkspace, workspaces]);

  const switchToWorkspace = (id: string) => {
    setCurrentWorkspace(id);
  };

  const createWorkspace = (name: string) => {
    const newWorkspace: Workspace = {
      id: `workspace-${Date.now()}`,
      name,
      windows: [],
      icon: 'folder',
    };
    setWorkspaces([...workspaces, newWorkspace]);
  };

  const deleteWorkspace = (id: string) => {
    if (workspaces.length <= 1) return;
    
    setWorkspaces(prev => prev.filter(w => w.id !== id));
    
    if (currentWorkspace === id) {
      setCurrentWorkspace(workspaces[0].id);
    }
  };

  const renameWorkspace = (id: string, name: string) => {
    setWorkspaces(prev => 
      prev.map(w => w.id === id ? { ...w, name } : w)
    );
  };

  const moveWindowToWorkspace = (windowId: string, workspaceId: string) => {
    setWorkspaces(prev => 
      prev.map(workspace => ({
        ...workspace,
        windows: workspace.id === workspaceId 
          ? [...workspace.windows.filter(id => id !== windowId), windowId]
          : workspace.windows.filter(id => id !== windowId)
      }))
    );
  };

  const addWindowToCurrentWorkspace = (windowId: string) => {
    setWorkspaces(prev =>
      prev.map(workspace =>
        workspace.id === currentWorkspace
          ? { ...workspace, windows: [...workspace.windows.filter(id => id !== windowId), windowId] }
          : { ...workspace, windows: workspace.windows.filter(id => id !== windowId) }
      )
    );
  };

  const removeWindowFromWorkspace = (windowId: string, workspaceId: string) => {
    setWorkspaces(prev =>
      prev.map(workspace =>
        workspace.id === workspaceId
          ? { ...workspace, windows: workspace.windows.filter(id => id !== windowId) }
          : workspace
      )
    );
  };

  return (
    <WorkspacesContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        switchToWorkspace,
        createWorkspace,
        deleteWorkspace,
        renameWorkspace,
        moveWindowToWorkspace,
        addWindowToCurrentWorkspace,
        removeWindowFromWorkspace,
      }}
    >
      {children}
    </WorkspacesContext.Provider>
  );
};
