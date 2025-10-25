import { useState, useEffect } from 'react';
import { 
  Monitor, Maximize, Palette, Sliders, Eye, Zap, Sun,
  Grid3x3, Move, RefreshCw, Check
} from 'lucide-react';
import { motion } from 'framer-motion';

export const DisplaySettingsApp = () => {
  const [resolution, setResolution] = useState('1920x1080');
  const [scale, setScale] = useState(100);
  const [brightness, setBrightness] = useState(80);
  const [nightLight, setNightLight] = useState(false);
  const [orientation, setOrientation] = useState('landscape');
  const [refreshRate, setRefreshRate] = useState(60);

  const resolutions = [
    '1920x1080',
    '2560x1440',
    '3840x2160',
    '1680x1050',
    '1440x900',
    '1366x768'
  ];

  const scales = [100, 125, 150, 175, 200];
  const refreshRates = [60, 75, 120, 144, 165, 240];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-semibold mb-2">Configurações de Vídeo</h1>
        <p className="text-muted-foreground mb-8">
          Ajuste o monitor, a resolução e outras configurações de vídeo
        </p>

        <div className="space-y-6 max-w-4xl">
          {/* Monitor Preview */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Monitor className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium">Pré-visualização do Monitor</h3>
            </div>
            
            <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl p-8 border-2 border-dashed border-border/50">
              <div className="aspect-video bg-card/50 rounded-xl border-2 border-border flex items-center justify-center">
                <div className="text-center">
                  <Monitor className="w-16 h-16 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">{resolution}</p>
                  <p className="text-xs text-muted-foreground">{refreshRate}Hz • {scale}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resolution */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Maximize className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium">Resolução</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {resolutions.map(res => (
                <button
                  key={res}
                  onClick={() => setResolution(res)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    resolution === res
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium text-sm">{res}</p>
                  {resolution === res && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                      <Check className="w-3 h-3" />
                      Selecionado
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Scale */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Grid3x3 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium">Escala e Layout</h3>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Tamanho de texto, apps e outros itens</span>
                <span className="text-sm font-medium">{scale}%</span>
              </div>
              <input
                type="range"
                min="100"
                max="200"
                step="25"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>100%</span>
                <span>200%</span>
              </div>
            </div>

            <div className="flex gap-3">
              {scales.map(s => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    scale === s
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>

          {/* Brightness & Night Light */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Sun className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium">Brilho e Luz Noturna</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Brilho</span>
                  <span className="text-sm font-medium">{brightness}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-amber-400 rounded-full transition-all"
                    style={{ width: `${brightness}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full mt-2"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Luz Noturna</p>
                    <p className="text-sm text-muted-foreground">
                      Reduz a luz azul para melhor sono
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setNightLight(!nightLight)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    nightLight ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <motion.div
                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    animate={{ x: nightLight ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium">Configurações Avançadas</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Taxa de Atualização</label>
                <select
                  value={refreshRate}
                  onChange={(e) => setRefreshRate(Number(e.target.value))}
                  className="w-full p-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {refreshRates.map(rate => (
                    <option key={rate} value={rate}>{rate} Hz</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Orientação</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setOrientation('landscape')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      orientation === 'landscape'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Monitor className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm font-medium">Paisagem</p>
                  </button>
                  <button
                    onClick={() => setOrientation('portrait')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      orientation === 'portrait'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Monitor className="w-6 h-6 mx-auto mb-2 transform rotate-90" />
                    <p className="text-sm font-medium">Retrato</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium mb-1">Aplicar Alterações</h4>
                <p className="text-sm text-muted-foreground">
                  As configurações serão aplicadas imediatamente
                </p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95">
                <Check className="w-5 h-5" />
                <span className="font-medium">Aplicar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
