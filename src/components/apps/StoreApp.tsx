import { useState } from 'react';
import { FiSearch, FiStar, FiDownload, FiMusic, FiCode, FiMessageCircle, FiVideo, FiImage as FiImageIcon, FiPhone } from 'react-icons/fi';
import { useToast } from '@/hooks/use-toast';

interface StoreApp {
  id: string;
  name: string;
  developer: string;
  icon: React.ReactNode;
  rating: number;
  downloads: string;
  description: string;
  category: string;
}

const featuredApps: StoreApp[] = [
  {
    id: 'spotify',
    name: 'Spotify',
    developer: 'Spotify AB',
    icon: <FiMusic className="w-8 h-8 text-green-500" />,
    rating: 4.5,
    downloads: '500M+',
    description: 'Música e podcasts para todos',
    category: 'Entretenimento',
  },
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    developer: 'Microsoft',
    icon: <FiCode className="w-8 h-8 text-blue-500" />,
    rating: 4.8,
    downloads: '100M+',
    description: 'Editor de código poderoso e leve',
    category: 'Ferramentas',
  },
  {
    id: 'discord',
    name: 'Discord',
    developer: 'Discord Inc.',
    icon: <FiMessageCircle className="w-8 h-8 text-indigo-500" />,
    rating: 4.6,
    downloads: '200M+',
    description: 'Converse, chame e compartilhe',
    category: 'Social',
  },
  {
    id: 'obs',
    name: 'OBS Studio',
    developer: 'OBS Project',
    icon: <FiVideo className="w-8 h-8 text-red-500" />,
    rating: 4.7,
    downloads: '50M+',
    description: 'Gravação e streaming de vídeo',
    category: 'Multimídia',
  },
  {
    id: 'gimp',
    name: 'GIMP',
    developer: 'GIMP Team',
    icon: <FiImageIcon className="w-8 h-8 text-purple-500" />,
    rating: 4.4,
    downloads: '75M+',
    description: 'Editor de imagens profissional',
    category: 'Criação',
  },
  {
    id: 'zoom',
    name: 'Zoom',
    developer: 'Zoom Video',
    icon: <FiPhone className="w-8 h-8 text-blue-600" />,
    rating: 4.3,
    downloads: '300M+',
    description: 'Videoconferências e reuniões',
    category: 'Produtividade',
  },
];

export const StoreApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const { toast } = useToast();

  const categories = ['Todos', 'Entretenimento', 'Ferramentas', 'Social', 'Multimídia', 'Criação', 'Produtividade'];

  const filteredApps = featuredApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = (app: StoreApp) => {
    toast({
      title: 'Instalando aplicativo',
      description: `${app.name} será instalado em breve.`,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 bg-[hsl(var(--window-titlebar))] border-b border-border">
        <h1 className="text-2xl font-semibold mb-4">Microsoft Store</h1>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar apps, jogos e mais..."
            className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary selectable"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-6 py-4 overflow-x-auto border-b border-border">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Apps Grid */}
      <div className="flex-1 p-6 overflow-auto selectable">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map(app => (
            <div key={app.id} className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  {app.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{app.name}</h3>
                  <p className="text-xs text-muted-foreground">{app.developer}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <FiStar className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs">{app.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{app.downloads}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{app.description}</p>
              <button
                onClick={() => handleInstall(app)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <FiDownload className="w-4 h-4" />
                <span className="text-sm font-medium">Instalar</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};