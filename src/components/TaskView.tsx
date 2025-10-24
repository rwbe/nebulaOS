import { useState } from 'react';
import { Plus, X, Pencil, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktops } from '@/contexts/DesktopContext';
import { useWindows } from '@/contexts/WindowContext';

interface TaskViewProps {
  onClose: () => void;
}

export const TaskView = ({ onClose }: TaskViewProps) => {
  const { desktops, currentDesktopId, createDesktop, deleteDesktop, switchDesktop, renameDesktop } = useDesktops();
  const { windows } = useWindows();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleRename = (id: string) => {
    if (editingName.trim()) {
      renameDesktop(id, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleDesktopClick = (id: string) => {
    switchDesktop(id);
    onClose();
  };

  const getDesktopWindows = (desktopId: string) => {
    const desktop = desktops.find((d) => d.id === desktopId);
    if (!desktop) return [];
    if (desktop.windows.length === 0) return [];
    return windows.filter((w) => desktop.windows.includes(w.id));
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
      />

      {/* Task View Panel */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed inset-0 z-[110] flex items-center justify-center p-8"
      >
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Visão de Tarefas</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Desktops Grid */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <AnimatePresence mode="popLayout">
              {desktops.map((desktop) => {
                const desktopWindows = getDesktopWindows(desktop.id);
                const isActive = desktop.id === currentDesktopId;

                return (
                  <motion.div
                    key={desktop.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="group relative"
                  >
                    {/* Desktop Preview */}
                    <button
                      onClick={() => handleDesktopClick(desktop.id)}
                      className={`w-full aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                        isActive
                          ? 'border-primary shadow-xl shadow-primary/20'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 p-4">
                        {/* Mini Windows Preview */}
                        <div className="space-y-2">
                          {desktopWindows.slice(0, 3).map((window, index) => (
                            <div
                              key={window.id}
                              className="h-12 bg-white/10 rounded border border-white/20 flex items-center px-3 gap-2"
                              style={{ marginLeft: `${index * 8}px` }}
                            >
                              <span className="text-xs">📱</span>
                              <span className="text-xs text-white/80 truncate">
                                {window.title}
                              </span>
                            </div>
                          ))}
                          {desktopWindows.length > 3 && (
                            <div className="text-xs text-white/60 text-center">
                              +{desktopWindows.length - 3} mais
                            </div>
                          )}
                          {desktopWindows.length === 0 && (
                            <div className="flex items-center justify-center h-full text-white/40 text-sm">
                              Desktop vazio
                            </div>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Desktop Name */}
                    <div className="mt-3 flex items-center justify-between">
                      {editingId === desktop.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRename(desktop.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-primary"
                            autoFocus
                          />
                          <button
                            onClick={() => handleRename(desktop.id)}
                            className="p-1 hover:bg-white/10 rounded text-green-400"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm text-white/90 font-medium">
                            {desktop.name}
                          </span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingId(desktop.id);
                                setEditingName(desktop.name);
                              }}
                              className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            {desktops.length > 1 && (
                              <button
                                onClick={() => deleteDesktop(desktop.id)}
                                className="p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* New Desktop Button */}
              <motion.button
                layout
                onClick={() => createDesktop()}
                className="aspect-video rounded-xl border-2 border-dashed border-white/30 hover:border-white/60 transition-colors flex flex-col items-center justify-center gap-2 text-white/60 hover:text-white/90"
              >
                <Plus className="w-8 h-8" />
                <span className="text-sm font-medium">Novo Desktop</span>
              </motion.button>
            </AnimatePresence>
          </div>

          {/* Help Text */}
          <div className="text-center text-white/60 text-sm">
            Clique em um desktop para alternar • Pressione Esc para fechar
          </div>
        </div>
      </motion.div>
    </>
  );
};
