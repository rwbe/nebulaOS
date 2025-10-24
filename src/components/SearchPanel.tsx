import { useState, useEffect } from 'react';
import { FiSearch, FiX, FiFile, FiSettings, FiGlobe, FiFolder } from 'react-icons/fi';
import { useWindows } from '@/contexts/WindowContext';
import { AppDefinition } from '@/types/window';

interface SearchPanelProps {
  onClose: () => void;
}

const allApps: AppDefinition[] = [
  { id: 'browser', name: 'Navegador', icon: 'globe', component: 'Browser' },
  { id: 'mail', name: 'Email', icon: 'mail', component: 'Mail' },
  { id: 'calendar', name: 'Calendário', icon: 'calendar', component: 'Calendar' },
  { id: 'clock', name: 'Relógio', icon: 'clock', component: 'Clock' },
  { id: 'paint', name: 'Paint', icon: 'paintbrush', component: 'Paint' },
  { id: 'photos', name: 'Fotos', icon: 'image', component: 'Photos' },
  { id: 'music', name: 'Música', icon: 'music', component: 'Music' },
  { id: 'vscode', name: 'VS Code', icon: 'code', component: 'VSCode' },
  { id: 'calculator', name: 'Calculadora', icon: 'calculator', component: 'Calculator' },
  { id: 'notepad', name: 'Bloco de Notas', icon: 'file-text', component: 'Notepad' },
  { id: 'store', name: 'Microsoft Store', icon: 'shopping-bag', component: 'Store' },
  { id: 'settings', name: 'Configurações', icon: 'settings', component: 'Settings' },
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

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/40 animate-fade-in backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Search Panel */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] glass-strong rounded-2xl shadow-window z-50 animate-scale-in overflow-hidden">
        {/* Search Input */}
        <div className="p-6 pb-4 border-b border-border">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar apps, arquivos, configurações e web..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-lg selectable"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-auto p-4">
          {!query && (
            <div className="text-center py-12 text-muted-foreground">
              <FiSearch className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Digite para pesquisar apps, arquivos e web</p>
            </div>
          )}

          {query && results.apps.length === 0 && results.web.length === 0 && results.files.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhum resultado encontrado para "{query}"</p>
            </div>
          )}

          {/* Apps */}
          {results.apps.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">Aplicativos</h3>
              <div className="space-y-1">
                {results.apps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleAppClick(app)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FiFolder className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{app.name}</div>
                      <div className="text-xs text-muted-foreground">Aplicativo</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Web */}
          {results.web.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">Web</h3>
              <div className="space-y-1">
                {results.web.map((site) => (
                  <button
                    key={site}
                    onClick={() => handleWebSearch(site)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FiGlobe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{site}</div>
                      <div className="text-xs text-muted-foreground">Pesquisar na web</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {results.files.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">Arquivos</h3>
              <div className="space-y-1">
                {results.files.map((file) => (
                  <button
                    key={file.name}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FiFile className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground">{file.path}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
