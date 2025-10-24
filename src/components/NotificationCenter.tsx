import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, X, Mail, Calendar, Download, Settings, 
  Volume2, Trash2, CheckCheck, Focus
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  timestamp: Date;
  app: string;
  read: boolean;
}

interface NotificationCenterProps {
  onClose: () => void;
}

export const NotificationCenter = ({ onClose }: NotificationCenterProps) => {
  const [focusAssist, setFocusAssist] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Novo Email',
      message: 'Você recebeu 3 novos emails em sua caixa de entrada',
      icon: Mail,
      timestamp: new Date(Date.now() - 5 * 60000),
      app: 'Email',
      read: false,
    },
    {
      id: '2',
      title: 'Reunião em 15 minutos',
      message: 'Reunião de equipe - Sala de Conferências Virtual',
      icon: Calendar,
      timestamp: new Date(Date.now() - 15 * 60000),
      app: 'Calendário',
      read: false,
    },
    {
      id: '3',
      title: 'Download concluído',
      message: 'Relatório_Q4_2025.pdf foi baixado com sucesso',
      icon: Download,
      timestamp: new Date(Date.now() - 30 * 60000),
      app: 'Navegador',
      read: true,
    },
    {
      id: '4',
      title: 'Atualização disponível',
      message: 'NebulaOS 1.1 está pronto para instalar',
      icon: Settings,
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
      app: 'Sistema',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'agora mesmo';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m atrás`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  };

  const quickActions = [
    {
      icon: Focus,
      label: 'Foco',
      active: focusAssist,
      onClick: () => setFocusAssist(!focusAssist),
    },
    {
      icon: Volume2,
      label: 'Som',
      active: true,
      onClick: () => {},
    },
  ];

  return (
    <>
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-96 glass-strong shadow-2xl z-50 flex flex-col border-l border-white/10"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Central de Notificações</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${
                    action.active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications Header */}
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">
              Notificações {unreadCount > 0 && `(${unreadCount})`}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Marcar todas como lidas"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Limpar todas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-muted-foreground"
              >
                <Bell className="w-12 h-12 mb-2 opacity-30" />
                <p className="text-sm">Nenhuma notificação</p>
              </motion.div>
            ) : (
              <div className="p-2 space-y-2">
                {notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 300 }}
                      layout
                      onClick={() => markAsRead(notification.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-all group ${
                        notification.read
                          ? 'bg-white/5 hover:bg-white/10'
                          : 'bg-primary/20 hover:bg-primary/30 border border-primary/30'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${
                          notification.read
                            ? 'bg-white/10'
                            : 'bg-primary/30'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-semibold truncate">
                              {notification.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{notification.app}</span>
                            <span>{getTimeAgo(notification.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Focus Assist Banner */}
        {focusAssist && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-orange-500/20 border-t border-orange-500/30 text-orange-500 text-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Focus className="w-4 h-4" />
              <span>Modo Foco Ativado - Notificações silenciadas</span>
            </div>
            <button
              onClick={() => setFocusAssist(false)}
              className="px-2 py-1 bg-orange-500/30 hover:bg-orange-500/40 rounded transition-colors"
            >
              Desativar
            </button>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};
