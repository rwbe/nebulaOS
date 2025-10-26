import { useState } from 'react';
import { Clipboard, Copy, Trash2, Pin, Search, Image, FileText, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClipboardItem {
  id: string;
  type: 'text' | 'image' | 'link';
  content: string;
  timestamp: Date;
  pinned: boolean;
}

export const ClipboardApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<ClipboardItem[]>([
    {
      id: '1',
      type: 'text',
      content: 'console.log("Hello, NebulaOS!");',
      timestamp: new Date(Date.now() - 5 * 60000),
      pinned: true,
    },
    {
      id: '2',
      type: 'link',
      content: 'https://github.com/rwbe/nebulaOS',
      timestamp: new Date(Date.now() - 15 * 60000),
      pinned: false,
    },
    {
      id: '3',
      type: 'text',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      timestamp: new Date(Date.now() - 30 * 60000),
      pinned: false,
    },
    {
      id: '4',
      type: 'text',
      content: 'npm install @nebula/core',
      timestamp: new Date(Date.now() - 60 * 60000),
      pinned: false,
    },
    {
      id: '5',
      type: 'link',
      content: 'https://docs.nebula-os.dev/getting-started',
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
      pinned: false,
    },
  ]);

  const filteredItems = items.filter((item) =>
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedItems = filteredItems.filter((item) => item.pinned);
  const regularItems = filteredItems.filter((item) => !item.pinned);

  const togglePin = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, pinned: !item.pinned } : item)));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const clearAll = () => {
    setItems(items.filter((item) => item.pinned));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'image':
        return Image;
      case 'link':
        return LinkIcon;
      default:
        return FileText;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'agora mesmo';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  const ClipboardItemCard = ({ item }: { item: ClipboardItem }) => {
    const Icon = getIcon(item.type);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        layout
        className={`p-4 rounded-xl border border-border bg-card hover:bg-accent transition-colors group ${
          item.pinned ? 'ring-2 ring-primary/20' : ''
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-muted shrink-0">
            <Icon className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm line-clamp-3 mb-2 break-all">{item.content}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatTime(item.timestamp)}</span>
              <span>•</span>
              <span className="capitalize">{item.type}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => togglePin(item.id)}
              className={`p-2 rounded-lg transition-colors ${
                item.pinned ? 'bg-primary/20 text-primary' : 'hover:bg-muted'
              }`}
              title={item.pinned ? 'Desafixar' : 'Fixar'}
            >
              <Pin className="w-4 h-4" />
            </button>
            <button
              onClick={() => copyToClipboard(item.content)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Copiar"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteItem(item.id)}
              className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
              title="Deletar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--window-bg))]">
      {/* Header */}
      <div className="p-4 border-b border-border bg-[hsl(var(--window-titlebar))]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clipboard className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Área de Transferência</h2>
          </div>
          <button
            onClick={clearAll}
            className="px-3 py-1.5 text-sm bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg transition-colors"
          >
            Limpar tudo
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar no histórico..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-6 rounded-full bg-muted/30 mb-4">
              <Clipboard className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Histórico vazio</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Copie algo para começar a construir seu histórico
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {pinnedItems.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Pin className="w-4 h-4" />
                  Fixados
                </h3>
                <div className="space-y-2">
                  <AnimatePresence>
                    {pinnedItems.map((item) => (
                      <ClipboardItemCard key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {regularItems.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Recentes</h3>
                <div className="space-y-2">
                  <AnimatePresence>
                    {regularItems.map((item) => (
                      <ClipboardItemCard key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="h-10 border-t border-border bg-[hsl(var(--window-titlebar))] flex items-center px-4 text-xs text-muted-foreground">
        <span>{items.length} itens no histórico</span>
        {pinnedItems.length > 0 && (
          <>
            <span className="mx-2">•</span>
            <span>{pinnedItems.length} fixados</span>
          </>
        )}
      </div>
    </div>
  );
};
