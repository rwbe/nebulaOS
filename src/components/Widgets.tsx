import { useState, useEffect, useRef } from 'react';
import { 
  Cloud, CloudRain, Sun, Wind, Cpu, HardDrive, Activity, 
  TrendingUp, Calendar as CalendarIcon, X, GripVertical, Plus,
  DollarSign, Newspaper
} from 'lucide-react';
import { motion, useDragControls, Reorder } from 'framer-motion';
import { useWidgets, Widget } from '@/contexts/WidgetsContext';

const WidgetContent = ({ widget }: { widget: Widget }) => {
  const [time, setTime] = useState(new Date());
  const [cpu, setCpu] = useState(45);
  const [ram, setRam] = useState(62);
  const [weather] = useState({
    temp: 24,
    condition: 'sunny',
    location: 'Rio de Janeiro',
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const cpuInterval = setInterval(() => {
      setCpu(Math.random() * 60 + 20);
      setRam(Math.random() * 40 + 40);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(cpuInterval);
    };
  }, []);

  const weatherIcons = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
    windy: Wind,
  };

  const WeatherIcon = weatherIcons[weather.condition as keyof typeof weatherIcons] || Sun;

  switch (widget.type) {
    case 'clock':
      return (
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <div className="text-2xl font-bold">
              {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-muted-foreground">
              {time.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
        </div>
      );

    case 'weather':
      return (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground mb-1">{weather.location}</div>
            <div className="text-3xl font-bold">{weather.temp}°C</div>
            <div className="text-xs text-muted-foreground">Ensolarado</div>
          </div>
          <div className="p-3 bg-primary/20 rounded-lg">
            <WeatherIcon className="w-8 h-8 text-primary" />
          </div>
        </div>
      );

    case 'performance':
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Activity className="w-4 h-4 text-primary" />
            Desempenho do Sistema
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>CPU</span>
              </div>
              <span className="text-muted-foreground">{cpu.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${cpu}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5" />
                <span>RAM</span>
              </div>
              <span className="text-muted-foreground">{ram.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${ram}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      );

    case 'notes':
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="w-4 h-4 text-primary" />
            Notas Rápidas
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-white/5 rounded-lg">
              • Reunião às 14:00
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              • Enviar relatório
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              • Revisar código
            </div>
          </div>
        </div>
      );

    case 'calendar':
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CalendarIcon className="w-4 h-4 text-primary" />
            {time.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </div>
          <div className="grid grid-cols-7 gap-1 text-xs text-center">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
              <div key={i} className="font-bold text-muted-foreground">{day}</div>
            ))}
            {Array.from({ length: 28 }, (_, i) => (
              <div 
                key={i} 
                className={`p-1 rounded ${i + 1 === time.getDate() ? 'bg-primary text-primary-foreground' : 'hover:bg-white/10'}`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      );

    case 'stocks':
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="w-4 h-4 text-primary" />
            Ações
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center p-2 bg-white/5 rounded">
              <span>AAPL</span>
              <span className="text-green-500">+2.4%</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white/5 rounded">
              <span>GOOGL</span>
              <span className="text-green-500">+1.2%</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white/5 rounded">
              <span>MSFT</span>
              <span className="text-red-500">-0.8%</span>
            </div>
          </div>
        </div>
      );

    case 'news':
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Newspaper className="w-4 h-4 text-primary" />
            Notícias
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-white/5 rounded-lg">
              <div className="font-medium">Nova atualização disponível</div>
              <div className="text-muted-foreground">Há 1 hora</div>
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              <div className="font-medium">Sistema otimizado</div>
              <div className="text-muted-foreground">Há 3 horas</div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

const DraggableWidget = ({ widget }: { widget: Widget }) => {
  const { removeWidget, updateWidgetPosition } = useWidgets();
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{ 
        left: 0, 
        right: window.innerWidth - widget.size.width,
        top: 0,
        bottom: window.innerHeight - widget.size.height - 60
      }}
      initial={{ 
        x: widget.position.x, 
        y: widget.position.y,
        scale: 0,
        opacity: 0
      }}
      animate={{ 
        x: widget.position.x, 
        y: widget.position.y,
        scale: 1,
        opacity: 1
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        updateWidgetPosition(widget.id, {
          x: widget.position.x + info.offset.x,
          y: widget.position.y + info.offset.y,
        });
      }}
      style={{ 
        position: 'fixed',
        width: widget.size.width,
        zIndex: isDragging ? 100 : 30,
      }}
      className={`glass-strong rounded-xl p-4 shadow-lg ${isDragging ? 'cursor-grabbing shadow-2xl' : 'cursor-grab'}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div 
          className="flex items-center gap-2 cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">{widget.title}</span>
        </div>
        <button
          onClick={() => removeWidget(widget.id)}
          className="p-1 rounded hover:bg-destructive/20 hover:text-destructive transition-colors"
          aria-label="Remover widget"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      <WidgetContent widget={widget} />
    </motion.div>
  );
};

export const Widgets = () => {
  const { widgets, addWidget, getAvailableWidgets } = useWidgets();
  const [showAddMenu, setShowAddMenu] = useState(false);

  const visibleWidgets = widgets.filter(w => w.isVisible);
  const availableWidgets = getAvailableWidgets();

  return (
    <>
      {visibleWidgets.map((widget) => (
        <DraggableWidget key={widget.id} widget={widget} />
      ))}

      {/* Add Widget Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed top-4 right-4 z-40"
      >
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="p-3 glass-strong rounded-full shadow-lg hover:scale-110 transition-transform"
            aria-label="Adicionar widget"
          >
            <Plus className="w-5 h-5 text-primary" />
          </button>

          {showAddMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-56 glass-strong rounded-xl shadow-xl p-2 space-y-1"
            >
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border">
                Adicionar Widget
              </div>
              {availableWidgets.map((widgetType) => (
                <button
                  key={widgetType.type}
                  onClick={() => {
                    if (widgetType.available) {
                      addWidget(widgetType.type);
                      setShowAddMenu(false);
                    }
                  }}
                  disabled={!widgetType.available}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    widgetType.available
                      ? 'hover:bg-primary/10 hover:text-primary'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  {widgetType.title}
                  {!widgetType.available && (
                    <span className="ml-2 text-xs text-muted-foreground">(Já adicionado)</span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};
