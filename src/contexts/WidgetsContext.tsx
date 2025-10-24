import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Widget {
  id: string;
  type: 'clock' | 'weather' | 'performance' | 'notes' | 'calendar' | 'stocks' | 'news';
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isVisible: boolean;
}

interface WidgetsContextType {
  widgets: Widget[];
  addWidget: (type: Widget['type']) => void;
  removeWidget: (id: string) => void;
  updateWidgetPosition: (id: string, position: { x: number; y: number }) => void;
  updateWidgetSize: (id: string, size: { width: number; height: number }) => void;
  toggleWidgetVisibility: (id: string) => void;
  getAvailableWidgets: () => Array<{ type: Widget['type']; title: string; available: boolean }>;
}

const WidgetsContext = createContext<WidgetsContextType | undefined>(undefined);

export const useWidgets = () => {
  const context = useContext(WidgetsContext);
  if (!context) {
    throw new Error('useWidgets must be used within WidgetsProvider');
  }
  return context;
};

const DEFAULT_WIDGETS: Widget[] = [
  {
    id: 'widget-clock',
    type: 'clock',
    title: 'Relógio',
    position: { x: window.innerWidth - 280, y: 16 },
    size: { width: 256, height: 100 },
    isVisible: true,
  },
  {
    id: 'widget-weather',
    type: 'weather',
    title: 'Clima',
    position: { x: window.innerWidth - 280, y: 128 },
    size: { width: 256, height: 120 },
    isVisible: true,
  },
  {
    id: 'widget-performance',
    type: 'performance',
    title: 'Desempenho',
    position: { x: window.innerWidth - 280, y: 260 },
    size: { width: 256, height: 140 },
    isVisible: true,
  },
  {
    id: 'widget-notes',
    type: 'notes',
    title: 'Notas Rápidas',
    position: { x: window.innerWidth - 280, y: 412 },
    size: { width: 256, height: 160 },
    isVisible: true,
  },
];

const WIDGET_TYPES: Array<{ type: Widget['type']; title: string }> = [
  { type: 'clock', title: 'Relógio' },
  { type: 'weather', title: 'Clima' },
  { type: 'performance', title: 'Desempenho do Sistema' },
  { type: 'notes', title: 'Notas Rápidas' },
  { type: 'calendar', title: 'Calendário' },
  { type: 'stocks', title: 'Ações' },
  { type: 'news', title: 'Notícias' },
];

export const WidgetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const saved = localStorage.getItem('nebula-widgets');
    return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
  });

  const saveWidgets = useCallback((newWidgets: Widget[]) => {
    localStorage.setItem('nebula-widgets', JSON.stringify(newWidgets));
    setWidgets(newWidgets);
  }, []);

  const addWidget = useCallback((type: Widget['type']) => {
    const widgetInfo = WIDGET_TYPES.find(w => w.type === type);
    if (!widgetInfo) return;

    const newWidget: Widget = {
      id: `widget-${type}-${Date.now()}`,
      type,
      title: widgetInfo.title,
      position: { 
        x: window.innerWidth - 280, 
        y: widgets.length * 140 + 16 
      },
      size: { width: 256, height: 120 },
      isVisible: true,
    };

    saveWidgets([...widgets, newWidget]);
  }, [widgets, saveWidgets]);

  const removeWidget = useCallback((id: string) => {
    saveWidgets(widgets.filter(w => w.id !== id));
  }, [widgets, saveWidgets]);

  const updateWidgetPosition = useCallback((id: string, position: { x: number; y: number }) => {
    saveWidgets(
      widgets.map(w => (w.id === id ? { ...w, position } : w))
    );
  }, [widgets, saveWidgets]);

  const updateWidgetSize = useCallback((id: string, size: { width: number; height: number }) => {
    saveWidgets(
      widgets.map(w => (w.id === id ? { ...w, size } : w))
    );
  }, [widgets, saveWidgets]);

  const toggleWidgetVisibility = useCallback((id: string) => {
    saveWidgets(
      widgets.map(w => (w.id === id ? { ...w, isVisible: !w.isVisible } : w))
    );
  }, [widgets, saveWidgets]);

  const getAvailableWidgets = useCallback(() => {
    return WIDGET_TYPES.map(widgetType => ({
      ...widgetType,
      available: !widgets.some(w => w.type === widgetType.type && w.isVisible),
    }));
  }, [widgets]);

  return (
    <WidgetsContext.Provider
      value={{
        widgets,
        addWidget,
        removeWidget,
        updateWidgetPosition,
        updateWidgetSize,
        toggleWidgetVisibility,
        getAvailableWidgets,
      }}
    >
      {children}
    </WidgetsContext.Provider>
  );
};
