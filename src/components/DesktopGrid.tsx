import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { DesktopIcon, DesktopItem, DraggableDesktopIcon } from './DesktopIcon';
import { ContextMenu, getDesktopContextMenuItems, getItemContextMenuItems } from './ContextMenu';
import { useWindows } from '@/contexts/WindowContext';
import { AppDefinition } from '@/types/window';

const GRID_SIZE = 100;
const GRID_ROWS = 7; // Vertical layout - 7 rows per column

export const DesktopGrid = () => {
  const { openWindow } = useWindows();
  const defaultItems: DesktopItem[] = [
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
      gridPosition: { x: 0, y: 4 }
    },
    { 
      id: 'vscode-shortcut', 
      name: 'VS Code', 
      type: 'app',
      icon: 'code',
      component: 'VSCode',
      gridPosition: { x: 0, y: 5 }
    },
  ];

  const [items, setItems] = useState<DesktopItem[]>(() => {
    const installedApps = JSON.parse(localStorage.getItem('desktopApps') || '[]');
    return [...defaultItems, ...installedApps];
  });

  useEffect(() => {
    const handleDesktopAppsUpdate = () => {
      const installedApps = JSON.parse(localStorage.getItem('desktopApps') || '[]');
      setItems([...defaultItems, ...installedApps]);
    };

    window.addEventListener('desktopAppsUpdated', handleDesktopAppsUpdate);
    return () => window.removeEventListener('desktopAppsUpdated', handleDesktopAppsUpdate);
  }, []);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    position: { x: number; y: number };
    item?: DesktopItem;
  } | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renamingValue, setRenamingValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleItemOpen = (item: DesktopItem) => {
    if (item.type === 'app' && item.component) {
      openWindow({
        id: item.id,
        name: item.name,
        icon: item.icon || 'file',
        component: item.component,
      } as AppDefinition);
    } else if (item.type === 'folder') {
      openWindow({
        id: 'file-manager',
        name: 'Gerenciador de Arquivos',
        icon: 'folder',
        component: 'FileManager',
      } as AppDefinition);
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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update grid positions for vertical layout
        return newItems.map((item, index) => ({
          ...item,
          gridPosition: {
            x: Math.floor(index / GRID_ROWS),
            y: index % GRID_ROWS,
          },
        }));
      });
    }
    
    setActiveId(null);
  };

  const handleRenameStart = (item: DesktopItem) => {
    setRenamingId(item.id);
    setRenamingValue(item.name);
  };

  const handleRenameComplete = () => {
    if (renamingId && renamingValue.trim()) {
      setItems(prev => prev.map(item => 
        item.id === renamingId 
          ? { ...item, name: renamingValue.trim() }
          : item
      ));
    }
    setRenamingId(null);
    setRenamingValue('');
  };

  const getContextMenuItems = () => {
    if (contextMenu?.item) {
      return getItemContextMenuItems(
        contextMenu.item.type,
        () => handleItemOpen(contextMenu.item!),
        () => handleRenameStart(contextMenu.item!),
        () => {
          setItems(prev => {
            const filtered = prev.filter(item => item.id !== contextMenu.item!.id);
            const desktopApps = JSON.parse(localStorage.getItem('desktopApps') || '[]');
            const updatedApps = desktopApps.filter((app: any) => app.id !== contextMenu.item!.id);
            localStorage.setItem('desktopApps', JSON.stringify(updatedApps));
            return filtered;
          });
        },
        () => console.log('Properties')
      );
    }

    return getDesktopContextMenuItems(
      () => {
        // Refresh - reorganize icons vertically
        setItems(prev => prev.map((item, index) => ({
          ...item,
          gridPosition: {
            x: Math.floor(index / GRID_ROWS),
            y: index % GRID_ROWS,
          },
        })));
      },
      () => openWindow({
        id: 'settings',
        name: 'Configurações',
        icon: 'settings',
        component: 'Settings',
      } as AppDefinition),
      () => openWindow({
        id: 'display-settings',
        name: 'Configurações de Vídeo',
        icon: 'monitor',
        component: 'DisplaySettings',
      } as AppDefinition),
      () => {
        const nextIndex = items.length;
        const newFolder: DesktopItem = {
          id: `folder-${Date.now()}`,
          name: 'Nova pasta',
          type: 'folder',
          icon: 'folder',
          gridPosition: { 
            x: Math.floor(nextIndex / GRID_ROWS), 
            y: nextIndex % GRID_ROWS 
          }
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
        setItems(prev => {
          const filtered = prev.filter(item => !selectedItems.includes(item.id));
          // Reorganize remaining items vertically
          return filtered.map((item, index) => ({
            ...item,
            gridPosition: {
              x: Math.floor(index / GRID_ROWS),
              y: index % GRID_ROWS,
            },
          }));
        });
        setSelectedItems([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedItems]);

  const activeItem = items.find((item) => item.id === activeId);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 p-4 overflow-hidden"
      onClick={handleDesktopClick}
      onContextMenu={(e) => handleContextMenu(e)}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
          <div className="relative" style={{ height: '100%' }}>
            <div 
              className="grid gap-2" 
              style={{
                gridTemplateRows: `repeat(${GRID_ROWS}, ${GRID_SIZE}px)`,
                gridAutoFlow: 'column',
                gridAutoColumns: `${GRID_SIZE}px`,
              }}
            >
              {items.map((item) => (
                <DraggableDesktopIcon
                  key={item.id}
                  item={item}
                  onOpen={handleItemOpen}
                  onContextMenu={handleContextMenu}
                  isSelected={selectedItems.includes(item.id)}
                  onSelect={() => handleItemSelect(item.id)}
                  isDragging={activeId === item.id}
                  isRenaming={renamingId === item.id}
                  renamingValue={renamingValue}
                  onRenamingChange={setRenamingValue}
                  onRenamingComplete={handleRenameComplete}
                />
              ))}
            </div>
          </div>
        </SortableContext>

        <DragOverlay>
          {activeItem ? (
            <motion.div 
              initial={{ scale: 1.1, rotate: 5 }}
              animate={{ scale: 1.15, rotate: 3 }}
              className="opacity-90 drop-shadow-2xl"
            >
              <div className="bg-primary/20 backdrop-blur-md rounded-xl border-2 border-primary/50 p-1 shadow-2xl shadow-primary/30">
                <DesktopIcon
                  item={activeItem}
                  onOpen={handleItemOpen}
                  onContextMenu={handleContextMenu}
                  isSelected={false}
                  onSelect={() => {}}
                />
              </div>
            </motion.div>
          ) : null}
        </DragOverlay>
      </DndContext>

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
