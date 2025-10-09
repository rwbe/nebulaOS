import { Wifi, Volume2, Battery, Sun, Moon, Monitor, Power } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface QuickSettingsProps {
  onClose: () => void;
}

export const QuickSettings = ({ onClose }: QuickSettingsProps) => {
  const { theme, toggleTheme } = useTheme();
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(80);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [batteryLevel] = useState(85);

  const quickActions = [
    {
      icon: Wifi,
      label: 'Wi-Fi',
      subtitle: wifiEnabled ? 'MinhaCasa-5G' : 'Desconectado',
      active: wifiEnabled,
      onClick: () => setWifiEnabled(!wifiEnabled),
    },
    {
      icon: theme === 'dark' ? Moon : Sun,
      label: theme === 'dark' ? 'Modo Escuro' : 'Modo Claro',
      subtitle: 'Alterar tema',
      active: theme === 'dark',
      onClick: toggleTheme,
    },
    {
      icon: Battery,
      label: 'Bateria',
      subtitle: `${batteryLevel}% carregado`,
      active: batteryLevel > 20,
      onClick: () => {},
    },
    {
      icon: Monitor,
      label: 'Projetar',
      subtitle: 'Apenas tela do PC',
      active: false,
      onClick: () => {},
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Quick Settings Panel */}
      <div className="fixed bottom-14 right-2 w-96 glass-strong rounded-xl shadow-window z-50 animate-slide-up overflow-hidden">
        {/* Quick Actions Grid */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className={`p-4 rounded-lg transition-all text-left ${
                    action.active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-2" />
                  <div className="text-sm font-medium">{action.label}</div>
                  <div className={`text-xs ${action.active ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {action.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            {/* Brightness */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  <span>Brilho</span>
                </div>
                <span className="text-muted-foreground">{brightness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              />
            </div>

            {/* Volume */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  <span>Volume</span>
                </div>
                <span className="text-muted-foreground">{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-3 flex items-center justify-between bg-[hsl(var(--startmenu-bg))]">
          <div className="flex items-center gap-2 text-sm">
            <Battery className="w-4 h-4" />
            <span>{batteryLevel}%</span>
          </div>
          <button 
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Configurações"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};
