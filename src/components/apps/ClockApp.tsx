import { useState, useEffect } from 'react';
import {
  Timer,
  AlarmClock,
  Clock as ClockIcon,
  Play,
  Pause,
  RotateCcw,
  Plus,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';

type LucideIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  days: number[];
}

interface Tab {
  id: 'timer' | 'alarm' | 'stopwatch';
  label: string;
  icon: LucideIcon; 
}

export const ClockApp = () => {
  const [activeTab, setActiveTab] = useState<'timer' | 'alarm' | 'stopwatch'>('timer');

  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);

  const [alarms, setAlarms] = useState<Alarm[]>([
    { id: '1', time: '07:00', label: 'Despertar', enabled: true, days: [1, 2, 3, 4, 5] },
    { id: '2', time: '13:00', label: 'Almoço', enabled: false, days: [1, 2, 3, 4, 5] },
  ]);

  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && (timerMinutes > 0 || timerSeconds > 0)) {
      interval = setInterval(() => {
        if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            setTimerRunning(false);
          } else {
            setTimerMinutes((prev) => prev - 1);
            setTimerSeconds(59);
          }
        } else {
          setTimerSeconds((prev) => prev - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerMinutes, timerSeconds]);

  // Stopwatch logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  const formatStopwatchTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const tabs: Tab[] = [
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'alarm', label: 'Alarme', icon: AlarmClock },
    { id: 'stopwatch', label: 'Cronômetro', icon: ClockIcon },
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--window-bg))]">
      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 pt-3 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[hsl(var(--window-bg))] text-foreground border-t border-x border-border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto">
        {/* Timer Tab */}
        {activeTab === 'timer' && (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="text-8xl font-bold mb-8 font-mono">
                {timerMinutes.toString().padStart(2, '0')}:
                {timerSeconds.toString().padStart(2, '0')}
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex flex-col items-center">
                  <label className="text-xs text-muted-foreground mb-2">Minutos</label>
                  <input
                    type="number"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(Math.max(0, Number(e.target.value)))}
                    disabled={timerRunning}
                    className="w-20 px-3 py-2 bg-background border border-border rounded-lg text-center"
                  />
                </div>
                <span className="text-4xl font-bold mt-6">:</span>
                <div className="flex flex-col items-center">
                  <label className="text-xs text-muted-foreground mb-2">Segundos</label>
                  <input
                    type="number"
                    value={timerSeconds}
                    onChange={(e) =>
                      setTimerSeconds(Math.max(0, Math.min(59, Number(e.target.value))))
                    }
                    disabled={timerRunning}
                    className="w-20 px-3 py-2 bg-background border border-border rounded-lg text-center"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {timerRunning ? 'Pausar' : 'Iniciar'}
                </button>
                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerMinutes(5);
                    setTimerSeconds(0);
                  }}
                  className="px-6 py-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Resetar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Alarm Tab */}
        {activeTab === 'alarm' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Alarmes</h2>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Alarme
              </button>
            </div>

            <div className="space-y-3">
              {alarms.map((alarm) => (
                <motion.div
                  key={alarm.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl border border-border bg-card flex items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold font-mono">{alarm.time}</span>
                      <span className="text-sm text-muted-foreground">{alarm.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {dayNames.map((day, index) => (
                        <span
                          key={day}
                          className={`text-xs px-2 py-1 rounded ${
                            alarm.days.includes(index)
                              ? 'bg-primary/20 text-primary'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alarm.enabled}
                        onChange={() =>
                          setAlarms((prev) =>
                            prev.map((a) =>
                              a.id === alarm.id ? { ...a, enabled: !a.enabled } : a
                            )
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Stopwatch Tab */}
        {activeTab === 'stopwatch' && (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="text-8xl font-bold mb-8 font-mono">
                {formatStopwatchTime(stopwatchTime)}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setStopwatchRunning(!stopwatchRunning)}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  {stopwatchRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {stopwatchRunning ? 'Pausar' : 'Iniciar'}
                </button>
                <button
                  onClick={() => {
                    setStopwatchRunning(false);
                    setStopwatchTime(0);
                  }}
                  className="px-6 py-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Resetar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
