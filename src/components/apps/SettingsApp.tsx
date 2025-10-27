import { useState, useEffect } from 'react';
import { 
  Monitor, Palette, Globe, Shield, Info
} from 'lucide-react';

const sections = [
  { id: 'system', name: 'Sistema', icon: Monitor },
  { id: 'personalization', name: 'Personalização', icon: Palette },
  { id: 'network', name: 'Rede', icon: Globe },
  { id: 'privacy', name: 'Privacidade', icon: Shield },
  { id: 'about', name: 'Sobre', icon: Info },
];

export const SettingsApp = () => {
  const [activeSection, setActiveSection] = useState('system');
  const [systemInfo, setSystemInfo] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    storageUsed: 0,
  });

  useEffect(() => {
    const updateSystemInfo = () => {
      setSystemInfo({
        cpuUsage: Math.floor(Math.random() * 30) + 20,
        memoryUsage: Math.floor(Math.random() * 40) + 30,
        storageUsed: 2.4,
      });
    };

    updateSystemInfo();
    const interval = setInterval(updateSystemInfo, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border p-4 bg-card/50">
        <h2 className="text-lg font-semibold mb-4">Configurações</h2>
        <nav className="space-y-1">
          {sections.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                  activeSection === section.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{section.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeSection === 'system' && (
          <div className="flex-1 overflow-auto">
            <div className="p-8">
              <h1 className="text-3xl font-semibold mb-2">Sistema</h1>
              <p className="text-muted-foreground mb-6">
                Configurações e informações do sistema
              </p>

              <div className="space-y-6">
                {/* Performance */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Monitor className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-medium">Desempenho</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">CPU</span>
                        <span className="text-sm font-medium">{systemInfo.cpuUsage}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${systemInfo.cpuUsage}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Memória</span>
                        <span className="text-sm font-medium">{systemInfo.memoryUsage}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full transition-all duration-500"
                          style={{ width: `${systemInfo.memoryUsage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Storage */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Monitor className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-medium">Armazenamento</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dados do aplicativo</span>
                      <span className="text-sm font-medium">{systemInfo.storageUsed} MB</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm">
                        Limpar Cache
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm">
                        Exportar Dados
                      </button>
                    </div>
                  </div>
                </div>

                {/* System Info */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Monitor className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-medium">Informações do Sistema</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Navegador</p>
                      <p className="text-sm font-medium">{navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Outro'}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Plataforma</p>
                      <p className="text-sm font-medium">{navigator.platform}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Idioma</p>
                      <p className="text-sm font-medium">{navigator.language}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Online</p>
                      <p className="text-sm font-medium">{navigator.onLine ? 'Sim' : 'Não'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder para outras seções */}
        {(activeSection === 'personalization' || activeSection === 'network' || 
          activeSection === 'privacy' || activeSection === 'about') && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Monitor className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Seção em Desenvolvimento</h3>
              <p className="text-muted-foreground">
                {sections.find(s => s.id === activeSection)?.name} estará disponível em breve
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};