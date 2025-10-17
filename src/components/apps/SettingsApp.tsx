import { useState } from 'react';
import { Monitor, Palette, Globe, Shield, Info, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAppearance } from '@/contexts/AppearanceContext';

const sections = [
  { id: 'system', name: 'Sistema', icon: Monitor },
  { id: 'personalization', name: 'Personalização', icon: Palette },
  { id: 'network', name: 'Rede', icon: Globe },
  { id: 'privacy', name: 'Privacidade', icon: Shield },
  { id: 'about', name: 'Sobre', icon: Info },
];

export const SettingsApp = () => {
  const [activeSection, setActiveSection] = useState('personalization');
  const { theme, toggleTheme } = useTheme();
  const { wallpaper, setWallpaper, wallpapers, accentColor, setAccentColor } = useAppearance();

  const accentColors = [
    { name: 'Azul', value: '217 100% 50%' },
    { name: 'Roxo', value: '280 100% 60%' },
    { name: 'Verde', value: '160 100% 40%' },
    { name: 'Laranja', value: '30 100% 50%' },
    { name: 'Rosa', value: '340 100% 60%' },
    { name: 'Ciano', value: '190 100% 50%' },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r border-border p-4">
        <h2 className="text-lg font-semibold mb-4">Configurações</h2>
        <nav className="space-y-1">
          {sections.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary text-primary-foreground'
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
      <div className="flex-1 p-8 overflow-auto selectable">
        {activeSection === 'personalization' && (
          <div>
            <h1 className="text-2xl font-semibold mb-6">Personalização</h1>
            
            <div className="space-y-6">
              {/* Theme */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium mb-4">Tema</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Modo {theme === 'dark' ? 'Escuro' : 'Claro'}</p>
                    <p className="text-sm text-muted-foreground">
                      Alterne entre modo claro e escuro
                    </p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-[hsl(var(--primary-hover))] transition-colors active-press"
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Wallpaper */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium mb-4">Papel de Parede</h3>
                <div className="grid grid-cols-3 gap-4">
                  {wallpapers.slice(0, 6).map(wp => (
                    <button
                      key={wp.id}
                      onClick={() => setWallpaper(wp)}
                      className={`aspect-video rounded-lg hover:ring-2 ring-primary transition-all overflow-hidden ${
                        wallpaper.id === wp.id ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <img src={wp.thumbnail} alt={wp.title} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium mb-4">Cor de Destaque</h3>
                <div className="flex gap-3">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setAccentColor(color.value)}
                      className={`w-12 h-12 rounded-full border-2 hover:scale-110 transition-transform ${
                        accentColor === color.value ? 'border-foreground' : 'border-border'
                      }`}
                      style={{ backgroundColor: `hsl(${color.value})` }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'system' && (
          <div>
            <h1 className="text-2xl font-semibold mb-6">Sistema</h1>
            <div className="bg-card rounded-lg p-6 border border-border">
              <p className="text-muted-foreground">Configurações do sistema</p>
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div>
            <h1 className="text-2xl font-semibold mb-6">Sobre</h1>
            <div className="bg-card rounded-lg p-6 border border-border space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Sistema Operacional</p>
                <p className="text-lg font-semibold">Windows 12 Web</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Versão</p>
                <p className="text-lg font-semibold">1.0.0</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Build</p>
                <p className="text-lg font-semibold">2025.01.001</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};