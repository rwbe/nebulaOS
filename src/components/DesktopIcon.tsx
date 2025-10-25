import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AppDefinition } from '@/types/window';
import { 
  Folder, FileText, Image, Music, Film, 
  Code, Archive, File, Globe, Mail,
  Calculator, Calendar, Settings, ShoppingBag
} from 'lucide-react';

interface DesktopIconProps {
  item: DesktopItem;
  onOpen: (item: DesktopItem) => void;
  onContextMenu: (e: React.MouseEvent, item: DesktopItem) => void;
  isSelected: boolean;
  onSelect: () => void;
  isDragging?: boolean;
  isRenaming?: boolean;
  renamingValue?: string;
  onRenamingChange?: (value: string) => void;
  onRenamingComplete?: () => void;
}

export interface DesktopItem {
  id: string;
  name: string;
  type: 'app' | 'folder' | 'file';
  icon?: string;
  component?: string;
  gridPosition?: { x: number; y: number };
}

const iconMap: Record<string, any> = {
  folder: Folder,
  'file-text': FileText,
  image: Image,
  music: Music,
  film: Film,
  code: Code,
  archive: Archive,
  file: File,
  globe: Globe,
  mail: Mail,
  calculator: Calculator,
  calendar: Calendar,
  settings: Settings,
  'shopping-bag': ShoppingBag,
};

export const DesktopIcon = ({ item, onOpen, onContextMenu, isSelected, onSelect, isRenaming, renamingValue, onRenamingChange, onRenamingComplete }: DesktopIconProps) => {
  const IconComponent = iconMap[item.icon || 'file'] || File;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        flex flex-col items-center justify-start gap-1 p-2 rounded-lg
        cursor-pointer select-none group w-24 min-h-24
        transition-all duration-200
        ${isSelected 
          ? 'bg-primary/30 backdrop-blur-sm border border-primary/50' 
          : 'hover:bg-white/10 hover:backdrop-blur-sm'
        }
      `}
      onDoubleClick={() => onOpen(item)}
      onClick={onSelect}
      onContextMenu={(e) => onContextMenu(e, item)}
    >
      <div className={`
        p-3 rounded-xl transition-all duration-200 shrink-0
        ${item.type === 'folder' 
          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' 
          : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
        }
        group-hover:shadow-lg group-hover:shadow-primary/20
      `}>
        <IconComponent className="w-8 h-8 text-white drop-shadow-lg" />
      </div>
      {isRenaming ? (
        <input
          type="text"
          value={renamingValue}
          onChange={(e) => onRenamingChange?.(e.target.value)}
          onBlur={() => onRenamingComplete?.()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onRenamingComplete?.();
            if (e.key === 'Escape') onRenamingComplete?.();
          }}
          className="text-xs text-white text-center font-medium bg-black/50 border border-primary rounded px-1 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-primary selectable"
          autoFocus
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="text-xs text-white text-center font-medium drop-shadow-lg break-words px-1 w-full">
          {item.name}
        </span>
      )}
    </motion.div>
  );
};

export const DraggableDesktopIcon = ({ 
  item, 
  onOpen, 
  onContextMenu, 
  isSelected, 
  onSelect,
  isDragging,
  isRenaming,
  renamingValue,
  onRenamingChange,
  onRenamingComplete 
}: DesktopIconProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const IconComponent = iconMap[item.icon || 'file'] || File;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isSortableDragging ? 1.1 : 1, 
        opacity: isSortableDragging ? 0.5 : 1 
      }}
      whileHover={{ scale: isSortableDragging ? 1.1 : 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`
        flex flex-col items-center justify-start gap-1 p-2 rounded-lg
        cursor-move select-none group w-24 min-h-24
        transition-all duration-200
        ${isSelected 
          ? 'bg-primary/30 backdrop-blur-sm border border-primary/50 shadow-lg shadow-primary/20' 
          : 'hover:bg-white/10 hover:backdrop-blur-sm'
        }
        ${isSortableDragging ? 'z-50 cursor-grabbing' : 'cursor-grab'}
      `}
      onDoubleClick={() => onOpen(item)}
      onClick={onSelect}
      onContextMenu={(e) => onContextMenu(e, item)}
    >
      <div className={`
        p-3 rounded-xl transition-all duration-200 shrink-0
        ${item.type === 'folder' 
          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' 
          : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
        }
        group-hover:shadow-lg group-hover:shadow-primary/20
      `}>
        <IconComponent className="w-8 h-8 text-white drop-shadow-lg" />
      </div>
      {isRenaming ? (
        <input
          type="text"
          value={renamingValue}
          onChange={(e) => onRenamingChange?.(e.target.value)}
          onBlur={() => onRenamingComplete?.()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onRenamingComplete?.();
            if (e.key === 'Escape') onRenamingComplete?.();
          }}
          className="text-xs text-white text-center font-medium bg-black/50 border border-primary rounded px-1 py-0.5 w-full focus:outline-none focus:ring-1 focus:ring-primary selectable"
          autoFocus
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="text-xs text-white text-center font-medium drop-shadow-lg break-words px-1 w-full">
          {item.name}
        </span>
      )}
    </motion.div>
  );
};
