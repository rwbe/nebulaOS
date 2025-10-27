import { useState, useEffect } from 'react';
import { 
  Monitor, Palette, Globe, Shield, Info, Moon, Sun, 
  Sparkles, Eye, Layers, PaintBucket, Image as ImageIcon,
  Zap, Grid3x3, Wifi, WifiOff, Lock, Cookie, MapPin, 
  Camera, Mic, Bell, Trash2, Download, Check
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import { motion } from 'framer-motion';

const sections = [
  { id: 'system', name: 'Sistema', icon: Monitor },
  { id: 'personalization', name: 'Personalização', icon: Palette },
  { id: 'network', name: 'Rede', icon: Globe },
  { id: 'privacy', name: 'Privacidade', icon: Shield },
  { id: 'about', name: 'Sobre', icon: Info },
];

export const SettingsApp = () => {
  const [activeSection, setActiveSection] = useState('system');
  const [personalizationTab, setPersonalizationTab] = useState('colors');
  const { theme, toggleTheme } = useTheme();
  const { wallpaper, setWallpaper, wallpapers, accentColor, setAccentColor } = useAppearance();
  const [visualEffects, setVisualEffects] = useState({
    transparency: true,
    animations: true,
    blur: true,
  });

  const [systemInfo, setSystemInfo] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    storageUsed: 0,
  });

  const [networkStatus, setNetworkStatus] = useState({
    online: navigator.onLine,
    type: 'wifi',
    speed: 'Rápida',
  });

  const [privacySettings, setPrivacySettings] = useState({
    location: false,
    camera: false,
    microphone: false,
    notifications: true,
    cookies: true,
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

    const handleOnline = () => setNetworkStatus(prev => ({ ...prev, online: true }));
    const handleOffline = () => setNetworkStatus(prev => ({ ...prev, online: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const accentColors = [
    { name: 'Azul Padrão', value: '217 100% 50%', hex: '#0078D4' },
    { name: 'Roxo', value: '280 100% 60%', hex: '#9933FF' },
    { name: 'Verde', value: '160 100% 40%', hex: '#00CC66' },
    { name: 'Laranja', value: '30 100% 50%', hex: '#FF8C00' },
    { name: 'Rosa', value: '340 100% 60%', hex: '#FF1493' },
    { name: 'Ciano', value: '190 100% 50%', hex: '#00CED1' },
  ];

  const personalizationTabs = [
    { id: 'colors', name: 'Cores', icon: PaintBucket },
    { id: 'wallpaper', name: 'Papel de Parede', icon: ImageIcon },
    { id: 'effects', name: 'Efeitos Visuais', icon: Sparkles },
    { id: 'layout', name: 'Layout', icon: Grid3x3 },
  ];

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
        {/* System Section */}
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

        {/* Customization Section */}
        {activeSection === 'personalization' && (
          <div className="flex-1 overflow-auto">
            <div className="p-8">
              <h1 className="text-3xl font-semibold mb-2">Personalização</h1>
              <p className="text-muted-foreground mb-6">
                Personalize a aparência do seu sistema
              </p>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b border-border">
                {personalizationTabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setPersonalizationTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-all ${
                        personalizationTab === tab.id
                          ? 'border-primary text-primary font-medium'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{tab.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {personalizationTab === 'colors' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Theme */}
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <Eye className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-medium">Tema do Sistema</h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Modo {theme === 'dark' ? 'Escuro' : 'Claro'}</p>
                          <p className="text-sm text-muted-foreground">
                            Alterne entre modo claro e escuro para melhor conforto visual
                          </p>
                        </div>
                        <button
                          onClick={toggleTheme}
                          className="p-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
                        >
                          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Accent Colors */}
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <PaintBucket className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-medium">Cor de Destaque</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Escolha uma cor para destacar botões, links e elementos importantes
                      </p>
                      <div className="grid grid-cols-6 gap-3">
                        {accentColors.map((color) => (
                          <motion.button
                            key={color.value}
                            onClick={() => setAccentColor(color.value)}
                            className={`relative w-full aspect-square rounded-xl border-2 transition-all ${
                              accentColor === color.value 
                                ? 'border-foreground ring-4 ring-primary/20 scale-105' 
                                : 'border-border hover:scale-105'
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {accentColor === color.value && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                                  <div className="w-3 h-3 bg-foreground rounded-full" />
                                </div>
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {personalizationTab === 'wallpaper' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-medium">Papéis de Parede</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Escolha um papel de parede para personalizar sua área de trabalho
                      </p>
                      
                      {/* Current wallpaper preview */}
                      <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <img 
                            src={wallpaper.thumbnail} 
                            alt={wallpaper.title}
                            className="w-24 h-14 object-cover rounded-lg border border-border"
                          />
                          <div>
                            <p className="font-medium">{wallpaper.title}</p>
                            <p className="text-sm text-muted-foreground">{wallpaper.author}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {wallpapers.map(wp => (
                          <motion.button
                            key={wp.id}
                            onClick={() => setWallpaper(wp)}
                            className={`group relative aspect-video rounded-lg overflow-hidden transition-all ${
                              wallpaper.id === wp.id 
                                ? 'ring-2 ring-primary shadow-lg scale-105' 
                                : 'hover:ring-2 hover:ring-primary/50 hover:scale-105'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <img 
                              src={wp.thumbnail} 
                              alt={wp.title} 
                              className="w-full h-full object-cover"
                            />
                            {wallpaper.id === wp.id && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                  <div className="w-4 h-4 bg-primary rounded-full" />
                                </div>
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {personalizationTab === 'effects' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-medium">Efeitos Visuais</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">
                        Customize os efeitos visuais do sistema
                      </p>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Layers className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium">Transparência</p>
                              <p className="text-sm text-muted-foreground">
                                Efeito de vidro em janelas e menus
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setVisualEffects({ ...visualEffects, transparency: !visualEffects.transparency })}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              visualEffects.transparency ? 'bg-primary' : 'bg-muted'
                            }`}
                          >
                            <motion.div
                              className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                              animate={{ x: visualEffects.transparency ? 24 : 0 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium">Animações</p>
                              <p className="text-sm text-muted-foreground">
                                Transições suaves entre telas
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setVisualEffects({ ...visualEffects, animations: !visualEffects.animations })}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              visualEffects.animations ? 'bg-primary' : 'bg-muted'
                            }`}
                          >
                            <motion.div
                              className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                              animate={{ x: visualEffects.animations ? 24 : 0 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {personalizationTab === 'layout' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <Grid3x3 className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-medium">Layout e Organização</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">
                        Personalize o layout da área de trabalho
                      </p>
                      <div className="p-8 bg-muted/30 rounded-lg text-center">
                        <Monitor className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">
                          Opções de layout em desenvolvimento
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Network Section */}
        {activeSection === 'network' && (
          <div className="flex-1 overflow-auto">
            <div className="p-8">
              <h1 className="text-3xl font-semibold mb-2">Rede e Internet</h1>
              <p className="text-muted-foreground mb-6">
                Gerencie suas conexões de rede
              </p>

              <div className="space-y-6">
                {/* Connection Status */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    {networkStatus.online ? (
                      <Wifi className="w-6 h-6 text-green-500" />
                    ) : (
                      <WifiOff className="w-6 h-6 text-destructive" />
                    )}
                    <div>
                      <h3 className="text-lg font-medium">
                        {networkStatus.online ? 'Conectado' : 'Desconectado'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {networkStatus.online ? `Conexão ${networkStatus.type.toUpperCase()} - ${networkStatus.speed}` : 'Sem conexão com a internet'}
                      </p>
                    </div>
                  </div>

                  {networkStatus.online && (
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Velocidade</p>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">{networkStatus.speed}</p>
                      </div>
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Tipo</p>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{networkStatus.type.toUpperCase()}</p>
                      </div>
                      <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Latência</p>
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">~50ms</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Network Settings */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                  <h3 className="text-lg font-medium mb-4">Configurações de Rede</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Modo Offline</p>
                          <p className="text-sm text-muted-foreground">Desativar todas as conexões de rede</p>
                        </div>
                      </div>
                      <button className={`relative w-12 h-6 rounded-full transition-colors bg-muted`}>
                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Economia de Dados</p>
                          <p className="text-sm text-muted-foreground">Reduzir uso de dados em segundo plano</p>
                        </div>
                      </div>
                      <button className={`relative w-12 h-6 rounded-full transition-colors bg-muted`}>
                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* DNS Settings */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                  <h3 className="text-lg font-medium mb-4">Configurações Avançadas</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium mb-1">DNS Primário</p>
                      <p className="text-xs text-muted-foreground">Automático (Provedor)</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium mb-1">Proxy</p>
                      <p className="text-xs text-muted-foreground">Nenhum proxy configurado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Section */}
        {activeSection === 'privacy' && (
          <div className="flex-1 overflow-auto">
            <div className="p-8">
              <h1 className="text-3xl font-semibold mb-2">Privacidade e Segurança</h1>
              <p className="text-muted-foreground mb-6">
                Controle suas configurações de privacidade
              </p>

              <div className="space-y-6">
                {/* Permissions */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-medium">Permissões do Navegador</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5" />
                        <div>
                          <p className="font-medium">Localização</p>
                          <p className="text-sm text-muted-foreground">Permitir que sites acessem sua localização</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPrivacySettings({...privacySettings, location: !privacySettings.location})}
                        className={`relative w-12 h-6 rounded-full transition-colors ${privacySettings.location ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <motion.div
                          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                          animate={{ x: privacySettings.location ? 24 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Camera className="w-5 h-5" />
                        <div>
                          <p className="font-medium">Câmera</p>
                          <p className="text-sm text-muted-foreground">Permitir que sites acessem sua câmera</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPrivacySettings({...privacySettings, camera: !privacySettings.camera})}
                        className={`relative w-12 h-6 rounded-full transition-colors ${privacySettings.camera ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <motion.div
                          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                          animate={{ x: privacySettings.camera ? 24 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mic className="w-5 h-5" />
                        <div>
                          <p className="font-medium">Microfone</p>
                          <p className="text-sm text-muted-foreground">Permitir que sites acessem seu microfone</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPrivacySettings({...privacySettings, microphone: !privacySettings.microphone})}
                        className={`relative w-12 h-6 rounded-full transition-colors ${privacySettings.microphone ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <motion.div
                          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                          animate={{ x: privacySettings.microphone ? 24 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5" />
                        <div>
                          <p className="font-medium">Notificações</p>
                          <p className="text-sm text-muted-foreground">Permitir que sites enviem notificações</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPrivacySettings({...privacySettings, notifications: !privacySettings.notifications})}
                        className={`relative w-12 h-6 rounded-full transition-colors ${privacySettings.notifications ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <motion.div
                          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                          animate={{ x: privacySettings.notifications ? 24 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Data & Privacy */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Cookie className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-medium">Dados e Privacidade</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Cookie className="w-5 h-5" />
                        <div>
                          <p className="font-medium">Cookies</p>
                          <p className="text-sm text-muted-foreground">Permitir sites a salvar cookies</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPrivacySettings({...privacySettings, cookies: !privacySettings.cookies})}
                        className={`relative w-12 h-6 rounded-full transition-colors ${privacySettings.cookies ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <motion.div
                          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                          animate={{ x: privacySettings.cookies ? 24 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </button>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                      Limpar Dados de Navegação
                    </button>

                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                      Baixar Meus Dados
                    </button>
                  </div>
                </div>

                {/* Security Status */}
                <div className="bg-card rounded-xl p-6 border border-green-500/20 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-500/10 rounded-full">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Seu sistema está protegido</h3>
                      <p className="text-sm text-muted-foreground">Todas as configurações de segurança estão ativas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for About Section */}
        {activeSection === 'about' && (
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