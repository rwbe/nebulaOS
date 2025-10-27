import { useState, useEffect } from 'react';
import { Search, X, File, Settings, Globe, Folder, Zap, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindows } from '@/contexts/WindowContext';
import { AppDefinition } from '@/types/window';

interface SearchPanelProps {
  onClose: () => void;
}


const allApps: AppDefinition[] = [
  { id: 'browser', name: 'Navegador', icon: 'globe', component: 'Browser' },
  { id: 'clipboard', name: 'Área de Transferência', icon: 'clipboard', component: 'Clipboard' },
  { id: 'mail', name: 'Email', icon: 'mail', component: 'Mail' },
  { id: 'calendar', name: 'Calendário', icon: 'calendar', component: 'Calendar' },
  { id: 'clock', name: 'Relógio', icon: 'clock', component: 'Clock' },
  { id: 'file-manager', name: 'Gerenciador de Arquivos', icon: 'folder', component: 'FileManager' },
  { id: 'paint', name: 'Paint', icon: 'paintbrush', component: 'Paint' },
  { id: 'photos', name: 'Fotos', icon: 'image', component: 'Photos' },
  { id: 'music', name: 'Música', icon: 'music', component: 'Music' },
  { id: 'task-manager', name: 'Gerenciador de Tarefas', icon: 'activity', component: 'TaskManager' },
  { id: 'terminal', name: 'Terminal', icon: 'terminal', component: 'Terminal' },
  { id: 'vscode', name: 'VS Code', icon: 'code', component: 'VSCode' },
  { id: 'calculator', name: 'Calculadora', icon: 'calculator', component: 'Calculator' },
  { id: 'notepad', name: 'Bloco de Notas', icon: 'file-text', component: 'Notepad' },
  { id: 'screen-recorder', name: 'Gravador de Tela', icon: 'video', component: 'ScreenRecorder' },
  { id: 'sticky-notes', name: 'Notas rápidas', icon: 'notes', component: 'StickyNotes' },
  { id: 'store', name: 'Microsoft Store', icon: 'shopping-bag', component: 'Store' },
  { id: 'settings', name: 'Configurações', icon: 'settings', component: 'Settings' },
  { id: 'voice-recorder', name: 'Gravador de Voz', icon: 'mic', component: 'VoiceRecorder' },
];

const webSuggestions = [
  'Gmail', 'YouTube', 'Google Drive', 'GitHub', 'Stack Overflow',
  'MDN Web Docs', 'Twitter', 'LinkedIn', 'Reddit', 'Netflix'
];

const filesSuggestions = [
  { name: 'Projeto.docx', type: 'document', path: 'Documentos' },
  { name: 'Apresentação.pptx', type: 'presentation', path: 'Documentos' },
  { name: 'Foto_Viagem.jpg', type: 'image', path: 'Imagens' },
  { name: 'Relatório.pdf', type: 'document', path: 'Downloads' },
];

export const SearchPanel = ({ onClose }: SearchPanelProps) => {
  const [query, setQuery] = useState('');
  const { openWindow } = useWindows();
  const [results, setResults] = useState<{
    apps: AppDefinition[];
    web: string[];
    files: typeof filesSuggestions;
  }>({
    apps: [],
    web: [],
    files: [],
  });

  useEffect(() => {
    if (!query.trim()) {
      setResults({ apps: [], web: [], files: [] });
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    const filteredApps = allApps.filter(app =>
      app.name.toLowerCase().includes(lowerQuery)
    );

    const filteredWeb = webSuggestions.filter(site =>
      site.toLowerCase().includes(lowerQuery)
    );

    const filteredFiles = filesSuggestions.filter(file =>
      file.name.toLowerCase().includes(lowerQuery)
    );

    setResults({
      apps: filteredApps,
      web: filteredWeb,
      files: filteredFiles,
    });
  }, [query]);

  const handleAppClick = (app: AppDefinition) => {
    openWindow(app);
    onClose();
  };

  const handleWebSearch = (site: string) => {
    openWindow({
      id: 'browser',
      name: 'Navegador',
      icon: 'globe',
      component: 'Browser',
    });
    onClose();
  };

  const hasResults = results.apps.length > 0 || results.web.length > 0 || results.files.length > 0;

  return (
    <>
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Search Panel - Centered Container */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          className="w-[650px] max-w-[90vw] glass-ultra rounded-2xl shadow-2xl overflow-hidden border border-white/10 pointer-events-auto"
        >
        {/* Search Input */}
        <div className="p-6 pb-4 border-b border-white/10 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-pulse-subtle" />
            <input
              type="text"
              placeholder="Pesquisar apps, arquivos, configurações..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg selectable transition-all placeholder-white/40"
              autoFocus
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[500px] overflow-auto custom-scrollbar">
          {!query ? (
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-block p-4 rounded-full bg-primary/10 mb-4"
              >
                <Zap className="w-8 h-8 text-primary" />
              </motion.div>
              <p className="text-sm text-muted-foreground">
                Digite para buscar aplicativos, arquivos e muito mais
              </p>
            </div>
          ) : !hasResults ? (
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-muted-foreground"
              >
                <Search className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhum resultado encontrado para "{query}"</p>
              </motion.div>
            </div>
          ) : (
            <div className="p-3 space-y-4">
              {/* Apps Results */}
              {results.apps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                    Aplicativos ({results.apps.length})
                  </h3>
                  <div className="space-y-1">
                    {results.apps.map((app, index) => (
                      <motion.button
                        key={app.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + index * 0.03 }}
                        onClick={() => handleAppClick(app)}
                        className="w-full p-3 rounded-xl hover:bg-white/10 transition-all flex items-center gap-3 text-left group"
                      >
                        <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                          <Zap className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{app.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Web Results */}
              {results.web.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                    Web ({results.web.length})
                  </h3>
                  <div className="space-y-1">
                    {results.web.map((site, index) => (
                      <motion.button
                        key={site}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.03 }}
                        onClick={() => handleWebSearch(site)}
                        className="w-full p-3 rounded-xl hover:bg-white/10 transition-all flex items-center gap-3 text-left group"
                      >
                        <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                          <Globe className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-sm font-medium">{site}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Files Results */}
              {results.files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                    Arquivos ({results.files.length})
                  </h3>
                  <div className="space-y-1">
                    {results.files.map((file, index) => (
                      <motion.button
                        key={file.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + index * 0.03 }}
                        className="w-full p-3 rounded-xl hover:bg-white/10 transition-all flex items-center gap-3 text-left group"
                      >
                        <div className="p-2 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                          <File className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{file.name}</div>
                          <div className="text-xs text-muted-foreground">{file.path}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 border-t border-white/10 bg-black/20">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 bg-white/10 rounded">Enter</kbd>
              <span>para abrir</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 bg-white/10 rounded">Esc</kbd>
              <span>para fechar</span>
            </div>
          </div>
        </div>
        </motion.div>
        </div>
    </>
  );
};
