import { useState } from 'react';
import { Search, ArrowLeft, ArrowRight, RotateCw, Home, Plus, X } from 'lucide-react';

interface Tab {
  id: string;
  title: string;
  url: string;
}

export const BrowserApp = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'Nova aba', url: '' }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');

  const activeTab = tabs.find(t => t.id === activeTabId);

  const addTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'Nova aba',
      url: ''
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (id: string) => {
    const newTabs = tabs.filter(t => t.id !== id);
    if (newTabs.length === 0) {
      newTabs.push({ id: Date.now().toString(), title: 'Nova aba', url: '' });
    }
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const updatedTabs = tabs.map(t =>
        t.id === activeTabId
          ? { ...t, title: searchQuery, url: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}` }
          : t
      );
      setTabs(updatedTabs);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 px-2 pt-2 bg-[hsl(var(--window-titlebar))] border-b border-border">
        <div className="flex-1 flex items-center gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-t-lg min-w-[150px] max-w-[200px] cursor-pointer group ${
                activeTabId === tab.id
                  ? 'bg-[hsl(var(--window-bg))]'
                  : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <span className="text-xs truncate flex-1">{tab.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:bg-muted/50 p-0.5 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addTab}
          className="p-2 hover:bg-muted/50 rounded"
          aria-label="Nova aba"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Address Bar */}
      <div className="flex items-center gap-2 p-3 bg-[hsl(var(--window-titlebar))] border-b border-border">
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-muted/50 rounded" aria-label="Voltar">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-muted/50 rounded" aria-label="Avançar">
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-muted/50 rounded" aria-label="Recarregar">
            <RotateCw className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-muted/50 rounded" aria-label="Início">
            <Home className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar ou digitar URL"
              className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary selectable"
            />
          </div>
        </form>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-auto selectable">
        {activeTab?.url ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Resultados da pesquisa</h2>
            <p className="text-muted-foreground">Pesquisando por: {activeTab.title}</p>
            <div className="space-y-6 mt-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-card p-4 rounded-lg border border-border">
                  <h3 className="text-lg font-medium text-primary mb-2">
                    Resultado {i} - {activeTab.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    https://exemplo{i}.com/{activeTab.title.toLowerCase().replace(/\s+/g, '-')}
                  </p>
                  <p className="text-sm">
                    Este é um resultado de demonstração para a pesquisa "{activeTab.title}". 
                    Em uma implementação real, estes seriam resultados reais de busca.
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <Search className="w-16 h-16 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-medium">Navegador Web</h3>
              <p className="text-muted-foreground">Digite algo na barra de pesquisa para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
