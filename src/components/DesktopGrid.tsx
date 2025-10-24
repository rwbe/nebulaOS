import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DesktopIcon, DesktopItem } from './DesktopIcon';
import { ContextMenu, getDesktopContextMenuItems, getItemContextMenuItems } from './ContextMenu';
import { useWindows } from '@/contexts/WindowContext';
import { AppDefinition } from '@/types/window';

const GRID_SIZE = 100;

export const DesktopGrid = () => {
  const { openWindow } = useWindows();
  const [items, setItems] = useState<DesktopItem[]>([
    { 
      id: 'this-pc', 
      name: 'Este Computador', 
      type: 'folder',
      icon: 'folder',
      gridPosition: { x: 0, y: 0 }
    },
    { 
      id: 'documents', 
      name: 'Documentos', 
      type: 'folder',
      icon: 'folder',
      gridPosition: { x: 0, y: 1 }
    },
    { 
      id: 'downloads', 
      name: 'Downloads', 
      type: 'folder',
      icon: 'folder',
      gridPosition: { x: 0, y: 2 }
    },
    { 
      id: 'recycle-bin', 
      name: 'Lixeira', 
      type: 'folder',
      icon: 'archive',
      gridPosition: { x: 0, y: 3 }
    },
    { 
      id: 'browser-shortcut', 
      name: 'Navegador', 
      type: 'app',
      icon: 'globe',
      component: 'Browser',
      gridPosition: { x: 1, y: 0 }
    },
    { 
      id: 'vscode-shortcut', 
      name: 'VS Code', 
      type: 'app',
      icon: 'code',
      component: 'VSCode',
      gridPosition: { x: 1, y: 1 }
    },
  ]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    position: { x: number; y: number };
    item?: DesktopItem;
  } | null>(null);
  const [draggedItem, setDraggedItem] = useState<DesktopItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleItemOpen = (item: DesktopItem) => {
    if (item.type === 'app' && item.component) {
      openWindow({
        id: item.id,
        name: item.name,
        icon: item.icon || 'file',
        component: item.component,
      } as AppDefinition);
    } else if (item.type === 'folder') {
      console.log(`Abrir pasta "${item.name}" desabilitado temporariamente.`);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, item?: DesktopItem) => {
    e.preventDefault();
    setContextMenu({
      position: { x: e.clientX, y: e.clientY },
      item,
    });
  };

  const handleItemSelect = (itemId: string, multi: boolean = false) => {
    if (multi) {
      setSelectedItems(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setSelectedItems([itemId]);
    }
  };

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedItems([]);
    }
  };

  const getContextMenuItems = () => {
    if (contextMenu?.item) {
      return getItemContextMenuItems(
        contextMenu.item.type,
        () => handleItemOpen(contextMenu.item!),
        () => console.log('Rename'),
        () => {
          setItems(prev => prev.filter(item => item.id !== contextMenu.item!.id));
        },
        () => console.log('Properties')
      );
    }

    return getDesktopContextMenuItems(
      () => console.log('Refresh'),
      () => openWindow({
        id: 'settings',
        name: 'Configurações',
        icon: 'settings',
        component: 'Settings',
      } as AppDefinition),
      () => console.log('Display settings'),
      () => {
        const newFolder: DesktopItem = {
          id: `folder-${Date.now()}`,
          name: 'Nova pasta',
          type: 'folder',
          icon: 'folder',
          gridPosition: { x: 0, y: items.length }
        };
        setItems(prev => [...prev, newFolder]);
      }
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        setSelectedItems(items.map(item => item.id));
      }
      if (e.key === 'Delete' && selectedItems.length > 0) {
        setItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedItems]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 p-4 overflow-hidden"
      onClick={handleDesktopClick}
      onContextMenu={(e) => handleContextMenu(e)}
    >
      <div className="relative" style={{ height: '100%' }}>
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(auto-fill, ${GRID_SIZE}px)`,
            gridAutoRows: `${GRID_SIZE}px`,
          }}
        >
          {items.map((item) => (
            <DesktopIcon
              key={item.id}
              item={item}
              onOpen={handleItemOpen}
              onContextMenu={handleContextMenu}
              isSelected={selectedItems.includes(item.id)}
              onSelect={() => handleItemSelect(item.id)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            position={contextMenu.position}
            items={getContextMenuItems()}
            onClose={() => setContextMenu(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
