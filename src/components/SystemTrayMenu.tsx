import { motion } from 'framer-motion';
import { 
  Home, Briefcase, Palette, Plus, User, Clock, Folder, Code, Terminal,
  Globe, Mail, FileText, X
} from 'lucide-react';
import { useWorkspaces } from '@/contexts/WorkspacesContext';
import { useState } from 'react';

interface SystemTrayMenuProps {
  onClose: () => void;
}

const workspaceIcons = {
  home: Home,
  briefcase: Briefcase,
  palette: Palette,
  folder: Folder,
  code: Code,
  terminal: Terminal,
};

const recentApps = [
  { id: 'browser', name: 'Navegador', icon: Globe, time: '2 min atrás' },
  { id: 'mail', name: 'Email', icon: Mail, time: '15 min atrás' },
  { id: 'notepad', name: 'Bloco de Notas', icon: FileText, time: '1h atrás' },
];

export const SystemTrayMenu = ({ onClose }: SystemTrayMenuProps) => {
  const { workspaces, currentWorkspace, switchToWorkspace, createWorkspace } = useWorkspaces();
  const [showNewWorkspace, setShowNewWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim()) {
      createWorkspace(newWorkspaceName);
      setNewWorkspaceName('');
      setShowNewWorkspace(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed bottom-16 right-4 w-80 glass-ultra rounded-2xl shadow-2xl z-50 overflow-hidden border border-white/10"
      >
        {/* Header com Usuário */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Usuário NebulaOS</h3>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[600px] overflow-auto custom-scrollbar">
          {/* Workspaces */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Espaços de Trabalho
              </h4>
              <motion.button
                onClick={() => setShowNewWorkspace(!showNewWorkspace)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>

            {showNewWorkspace && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateWorkspace()}
                    placeholder="Nome do workspace..."
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    autoFocus
                  />
                  <button
                    onClick={handleCreateWorkspace}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Criar
                  </button>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-3 gap-2">
              {workspaces.map((workspace, index) => {
                const Icon = workspaceIcons[workspace.icon as keyof typeof workspaceIcons] || Folder;
                const isActive = workspace.id === currentWorkspace;
                
                return (
                  <motion.button
                    key={workspace.id}
                    onClick={() => {
                      switchToWorkspace(workspace.id);
                      onClose();
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium truncate w-full text-center">
                        {workspace.name}
                      </span>
                      <span className="text-[10px] opacity-60">
                        Ctrl+{index + 1}
                      </span>
                    </div>
                    {isActive && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Apps Recentes */}
          <div className="p-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Apps Recentes
            </h4>
            <div className="space-y-1">
              {recentApps.map((app) => {
                const Icon = app.icon;
                return (
                  <motion.button
                    key={app.id}
                    onClick={onClose}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-2 rounded-lg hover:bg-white/10 transition-all flex items-center gap-3 text-left"
                  >
                    <div className="p-2 rounded-lg bg-white/5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{app.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{app.time}</span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
