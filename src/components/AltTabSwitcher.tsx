import { motion, AnimatePresence } from 'framer-motion';
import { WindowState } from '@/types/window';
import { useEffect } from 'react';

interface AltTabSwitcherProps {
  windows: WindowState[];
  selectedIndex: number;
  onClose: () => void;
  onSelect: (index: number) => void;
}

export const AltTabSwitcher = ({ windows, selectedIndex, onClose, onSelect }: AltTabSwitcherProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && e.altKey) {
        e.preventDefault();
        if (e.shiftKey) {
          onSelect((selectedIndex - 1 + windows.length) % windows.length);
        } else {
          onSelect((selectedIndex + 1) % windows.length);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedIndex, windows.length, onClose, onSelect]);

  if (windows.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="glass-strong rounded-2xl p-6 shadow-2xl max-w-4xl w-full mx-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            {windows.map((window, index) => (
              <motion.div
                key={window.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(index);
                }}
                className={`
                  flex-shrink-0 w-48 h-32 rounded-xl overflow-hidden cursor-pointer
                  transition-all duration-200 ${
                    index === selectedIndex
                      ? 'ring-4 ring-primary shadow-2xl scale-110'
                      : 'ring-2 ring-border/50 hover:ring-primary/50'
                  }
                `}
              >
                <div className="w-full h-full bg-gradient-to-br from-muted/80 to-muted/50 flex flex-col">
                  <div className="flex items-center gap-2 px-3 py-2 bg-black/30 border-b border-border/30">
                    <div className="w-4 h-4 bg-primary/30 rounded flex-shrink-0" />
                    <span className="text-xs font-medium truncate">{window.title}</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <div className="w-6 h-6 bg-primary rounded" />
                      </div>
                      <p className="text-xs text-muted-foreground">{window.title}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <kbd className="px-2 py-1 bg-black/30 rounded">Alt</kbd> +{' '}
            <kbd className="px-2 py-1 bg-black/30 rounded">Tab</kbd> para navegar •{' '}
            <kbd className="px-2 py-1 bg-black/30 rounded">Enter</kbd> para selecionar
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
