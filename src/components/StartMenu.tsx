import { Search, Power, Settings, User } from 'lucide-react';
import { useState } from 'react';
import { useWindows } from '@/contexts/WindowContext';
import { AppDefinition } from '@/types/window';

interface StartMenuProps {
  onClose: () => void;
}

const allApps: AppDefinition[] = [
  { id: 'browser', name: 'Navegador', icon: 'globe', component: 'Browser' },
  { id: 'calculator', name: 'Calculadora', icon: 'calculator', component: 'Calculator' },
  { id: 'calendar', name: 'Calendário', icon: 'calendar', component: 'Calendar' },
  { id: 'mail', name: 'Email', icon: 'mail', component: 'Mail' },
  { id: 'music', name: 'Música', icon: 'music', component: 'Music' },
  { id: 'paint', name: 'Paint', icon: 'paintbrush', component: 'Paint' },
  { id: 'photos', name: 'Fotos', icon: 'image', component: 'Photos' },
  { id: 'vscode', name: 'VS Code', icon: 'code', component: 'VSCode' },
  { id: 'notepad', name: 'Bloco de Notas', icon: 'file-text', component: 'Notepad' },
  { id: 'screen-recorder', name: 'Gravador', icon: 'video', component: 'ScreenRecorder' },
  { id: 'voice-recorder', name: 'Voz', icon: 'mic', component: 'VoiceRecorder' },
  { id: 'store', name: 'Microsoft Store', icon: 'shopping-bag', component: 'Store' },
  { id: 'settings', name: 'Configurações', icon: 'settings', component: 'Settings' },
  
];

export const StartMenu = ({ onClose }: StartMenuProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { openWindow } = useWindows();

  const filteredApps = allApps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAppClick = (app: AppDefinition) => {
    openWindow(app);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 animate-fade-in"
        onClick={onClose}
      />

      {/* Start Menu */}
      <div className="fixed bottom-14 left-2 w-[600px] h-[700px] glass-strong rounded-xl shadow-window z-50 animate-slide-up overflow-hidden">
        {/* Search Bar */}
        <div className="p-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar apps, configurações, documentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary selectable"
              autoFocus
            />
          </div>
        </div>

        {/* Pinned Apps */}
        <div className="px-6 pb-4">
          <h2 className="text-sm font-medium mb-3">Fixados</h2>
          <div className="grid grid-cols-4 gap-3">
            {filteredApps.map(app => (
              <button
                key={app.id}
                onClick={() => handleAppClick(app)}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-[hsl(var(--startmenu-hover))] transition-colors active-press"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <span className="text-xs text-center">{app.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div className="px-6 pb-4 flex-1">
          <h2 className="text-sm font-medium mb-3">Recomendados</h2>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[hsl(var(--startmenu-hover))] transition-colors">
              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                <span className="text-sm">📄</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">Documento sem título</p>
                <p className="text-xs text-muted-foreground">Editado há 2 horas</p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[hsl(var(--startmenu-bg))] border-t border-border flex items-center justify-between px-6">
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[hsl(var(--startmenu-hover))] transition-colors">
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">Usuário</span>
          </button>
          <button 
            className="p-2 rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors"
            aria-label="Desligar"
          >
            <Power className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
};
