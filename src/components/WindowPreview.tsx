import { motion, AnimatePresence } from 'framer-motion';
import { WindowState } from '@/types/window';
import { X } from 'lucide-react';

interface WindowPreviewProps {
  window: WindowState;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
}

export const WindowPreview = ({ window, onClose, onFocus }: WindowPreviewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="glass-strong rounded-xl overflow-hidden shadow-2xl border border-border/50"
      style={{ width: 280, height: 180 }}
      onClick={() => onFocus(window.id)}
    >
      {/* Preview Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-black/20 border-b border-border/30">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-4 h-4 bg-primary/30 rounded flex-shrink-0" />
          <span className="text-xs font-medium truncate">{window.title}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose(window.id);
          }}
          className="p-1 rounded hover:bg-destructive/20 hover:text-destructive transition-colors flex-shrink-0"
          aria-label="Fechar janela"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Preview Content */}
      <div className="relative w-full h-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-primary/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <div className="w-6 h-6 bg-primary rounded" />
          </div>
          <p className="text-xs text-muted-foreground">{window.title}</p>
          {window.isMinimized && (
            <p className="text-[10px] text-muted-foreground mt-1">Minimizado</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface TaskbarPreviewProps {
  windows: WindowState[];
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  position: { x: number; y: number };
}

export const TaskbarPreview = ({ windows, onClose, onFocus, position }: TaskbarPreviewProps) => {
  if (windows.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="fixed z-[60] flex gap-3 p-3"
        style={{
          left: position.x,
          bottom: 60,
        }}
      >
        {windows.map((window) => (
          <WindowPreview
            key={window.id}
            window={window}
            onClose={onClose}
            onFocus={onFocus}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
