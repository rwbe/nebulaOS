import { motion } from 'framer-motion';
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

export const DesktopIcon = ({ item, onOpen, onContextMenu, isSelected, onSelect }: DesktopIconProps) => {
  const IconComponent = iconMap[item.icon || 'file'] || File;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        flex flex-col items-center justify-center gap-1 p-3 rounded-lg
        cursor-pointer select-none group w-24 h-24
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
        p-3 rounded-xl transition-all duration-200
        ${item.type === 'folder' 
          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' 
          : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
        }
        group-hover:shadow-lg
      `}>
        <IconComponent className="w-8 h-8 text-white drop-shadow-lg" />
      </div>
      <span className="text-xs text-white text-center font-medium drop-shadow-lg line-clamp-2 px-1">
        {item.name}
      </span>
    </motion.div>
  );
};
