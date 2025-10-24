import { useState } from 'react';
import { 
  ChevronRight, Home, Folder, File, Image, Music, 
  Film, FileText, Download, Upload, Search, Grid, 
  List, ArrowLeft, ArrowRight, ChevronUp, MoreVertical,
  Star, Clock, Trash2, HardDrive, FolderOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: 'image' | 'video' | 'audio' | 'document' | 'other';
  size?: string;
  modified: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const FileManagerApp = () => {
  const [currentPath, setCurrentPath] = useState(['Este Computador']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const folders: FileItem[] = [
    { id: '1', name: 'Documentos', type: 'folder', modified: 'Hoje, 14:30', icon: Folder },
    { id: '2', name: 'Downloads', type: 'folder', modified: 'Hoje, 10:15', icon: Download },
    { id: '3', name: 'Imagens', type: 'folder', modified: 'Ontem', icon: Image },
    { id: '4', name: 'Música', type: 'folder', modified: '2 dias atrás', icon: Music },
    { id: '5', name: 'Vídeos', type: 'folder', modified: '3 dias atrás', icon: Film },
    { id: '6', name: 'Desktop', type: 'folder', modified: 'Hoje, 09:00', icon: FolderOpen },
  ];

  const files: FileItem[] = [
    { id: 'f1', name: 'Relatório.docx', type: 'file', fileType: 'document', size: '2.4 MB', modified: 'Hoje, 15:20' },
    { id: 'f2', name: 'Apresentação.pptx', type: 'file', fileType: 'document', size: '5.1 MB', modified: 'Hoje, 11:45' },
    { id: 'f3', name: 'Foto_Praia.jpg', type: 'file', fileType: 'image', size: '3.8 MB', modified: 'Ontem' },
    { id: 'f4', name: 'Música.mp3', type: 'file', fileType: 'audio', size: '4.2 MB', modified: '2 dias atrás' },
  ];

  const allItems = [...folders, ...files].filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickAccess = [
    { icon: Home, label: 'Início', path: ['Início'] },
    { icon: FolderOpen, label: 'Desktop', path: ['Desktop'] },
    { icon: Download, label: 'Downloads', path: ['Downloads'] },
    { icon: FileText, label: 'Documentos', path: ['Documentos'] },
    { icon: Image, label: 'Imagens', path: ['Imagens'] },
  ];

  const drives = [
    { icon: HardDrive, label: 'Disco Local (C:)', size: '237 GB livre de 476 GB' },
    { icon: HardDrive, label: 'Disco Local (D:)', size: '512 GB livre de 1 TB' },
  ];

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item.name]);
    }
  };

  const handleBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') return item.icon || Folder;
    switch (item.fileType) {
      case 'image': return Image;
      case 'video': return Film;
      case 'audio': return Music;
      case 'document': return FileText;
      default: return File;
    }
  };

  return (
    <div className="flex h-full bg-[hsl(var(--window-bg))]">
      {/* Sidebar */}
      <div className="w-56 border-r border-border bg-[hsl(var(--window-titlebar))] flex flex-col">
        {/* Quick Access */}
        <div className="p-3">
          <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">Acesso Rápido</h3>
          <div className="space-y-1">
            {quickAccess.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => setCurrentPath(item.path)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-border my-2" />

        {/* Drives */}
        <div className="p-3 flex-1 overflow-auto">
          <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">Este Computador</h3>
          <div className="space-y-2">
            {drives.map((drive) => {
              const Icon = drive.icon;
              return (
                <div
                  key={drive.label}
                  className="px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 text-sm">
                    <Icon className="w-4 h-4" />
                    <span className="flex-1 truncate">{drive.label}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 ml-7">
                    {drive.size}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 border-b border-border bg-[hsl(var(--window-titlebar))] flex items-center px-4 gap-2">
          <button
            onClick={handleBack}
            disabled={currentPath.length <= 1}
            className="p-2 hover:bg-muted rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg opacity-50 cursor-not-allowed">
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg">
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Breadcrumb */}
          <div className="flex-1 flex items-center gap-1 px-3 py-1.5 bg-background/50 rounded-lg overflow-x-auto">
            {currentPath.map((path, index) => (
              <div key={index} className="flex items-center gap-1 shrink-0">
                {index > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
                <button
                  onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                  className="text-sm hover:underline"
                >
                  {path}
                </button>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-background/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-auto p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-4 gap-4">
              {allItems.map((item) => {
                const Icon = getFileIcon(item);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    onDoubleClick={() => handleItemClick(item)}
                    className="p-4 rounded-xl border border-border bg-card hover:bg-accent cursor-pointer transition-colors group"
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className={`p-4 rounded-xl ${
                        item.type === 'folder' 
                          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' 
                          : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
                      }`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <span className="text-sm font-medium line-clamp-2">{item.name}</span>
                      {item.size && (
                        <span className="text-xs text-muted-foreground">{item.size}</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1">
              {allItems.map((item) => {
                const Icon = getFileIcon(item);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onDoubleClick={() => handleItemClick(item)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1 text-sm">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.modified}</span>
                    {item.size && (
                      <span className="text-xs text-muted-foreground w-20 text-right">{item.size}</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="h-8 border-t border-border bg-[hsl(var(--window-titlebar))] flex items-center px-4 text-xs text-muted-foreground">
          <span>{allItems.length} itens</span>
          {selectedItems.length > 0 && (
            <span className="ml-4">{selectedItems.length} selecionado(s)</span>
          )}
        </div>
      </div>
    </div>
  );
};
