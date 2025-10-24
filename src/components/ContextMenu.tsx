import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, Copy, Trash2, Edit3, Share2, 
  Info, RefreshCw, Monitor, Image, Settings,
  Sparkles, Palette, Lock, Eye
} from 'lucide-react';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  action: () => void;
  divider?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  position: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
}

export const ContextMenu = ({ position, items, onClose }: ContextMenuProps) => {
  return (
    <>
      <div 
        className="fixed inset-0 z-[60]" 
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15 }}
        className="fixed z-[70] min-w-[220px] glass-strong rounded-xl shadow-2xl overflow-hidden border border-white/10"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        <div className="py-2">
          {items.map((item, index) => (
            <div key={item.id}>
              {item.divider && index > 0 && (
                <div className="h-px bg-white/10 my-2" />
              )}
              <button
                onClick={() => {
                  if (!item.disabled) {
                    item.action();
                    onClose();
                  }
                }}
                disabled={item.disabled}
                className={`
                  w-full px-4 py-2.5 flex items-center gap-3 text-sm
                  transition-colors duration-150
                  ${item.disabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-white/10 active:bg-white/20 cursor-pointer'
                  }
                `}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export const getDesktopContextMenuItems = (
  onRefresh: () => void,
  onPersonalize: () => void,
  onDisplaySettings: () => void,
  onNewFolder: () => void
): ContextMenuItem[] => [
  {
    id: 'view',
    label: 'Visualizar',
    icon: Eye,
    action: () => {},
  },
  {
    id: 'sort',
    label: 'Classificar por',
    icon: RefreshCw,
    action: () => {},
  },
  {
    id: 'refresh',
    label: 'Atualizar',
    icon: RefreshCw,
    action: onRefresh,
    divider: true,
  },
  {
    id: 'new-folder',
    label: 'Nova pasta',
    icon: FolderOpen,
    action: onNewFolder,
  },
  {
    id: 'personalize',
    label: 'Personalizar',
    icon: Palette,
    action: onPersonalize,
    divider: true,
  },
  {
    id: 'display',
    label: 'Configurações de vídeo',
    icon: Monitor,
    action: onDisplaySettings,
  },
];

export const getItemContextMenuItems = (
  itemType: 'app' | 'folder' | 'file',
  onOpen: () => void,
  onRename: () => void,
  onDelete: () => void,
  onProperties: () => void
): ContextMenuItem[] => {
  const items: ContextMenuItem[] = [
    {
      id: 'open',
      label: 'Abrir',
      icon: FolderOpen,
      action: onOpen,
    },
  ];

  if (itemType === 'file' || itemType === 'folder') {
    items.push(
      {
        id: 'share',
        label: 'Compartilhar',
        icon: Share2,
        action: () => {},
        divider: true,
      },
      {
        id: 'copy',
        label: 'Copiar',
        icon: Copy,
        action: () => {},
      }
    );
  }

  items.push(
    {
      id: 'rename',
      label: 'Renomear',
      icon: Edit3,
      action: onRename,
      divider: true,
    },
    {
      id: 'delete',
      label: 'Excluir',
      icon: Trash2,
      action: onDelete,
    },
    {
      id: 'properties',
      label: 'Propriedades',
      icon: Info,
      action: onProperties,
      divider: true,
    }
  );

  return items;
};
