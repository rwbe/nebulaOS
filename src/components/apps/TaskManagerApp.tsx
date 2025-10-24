import { useState, useEffect } from 'react';
import { Cpu, HardDrive, Activity, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWindows } from '@/contexts/WindowContext';

interface Process {
  id: string;
  name: string;
  cpu: number;
  memory: number;
  disk: number;
  status: 'running' | 'suspended';
}

export const TaskManagerApp = () => {
  const { windows, closeWindow } = useWindows();
  const [activeTab, setActiveTab] = useState<'processes' | 'performance' | 'apps'>('processes');
  const [sortBy, setSortBy] = useState<'cpu' | 'memory' | 'name'>('cpu');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [systemStats, setSystemStats] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
  });

  const processes: Process[] = [
    ...windows.map((window) => ({
      id: window.id,
      name: window.title,
      cpu: Math.random() * 30 + 5,
      memory: Math.random() * 500 + 100,
      disk: Math.random() * 10,
      status: (window.isMinimized ? 'suspended' : 'running') as 'running' | 'suspended',
    })),
    { id: 'system', name: 'Sistema', cpu: 2.5, memory: 150.3, disk: 0.1, status: 'running' as 'running' | 'suspended' },
    { id: 'desktop', name: 'Gerenciador de Janelas do Desktop', cpu: 1.2, memory: 89.4, disk: 0.0, status: 'running' as 'running' | 'suspended' },
    { id: 'explorer', name: 'Windows Explorer', cpu: 0.8, memory: 45.2, disk: 0.2, status: 'running' as 'running' | 'suspended' },
  ];

  const sortedProcesses = [...processes].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else {
      comparison = a[sortBy] - b[sortBy];
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats({
        cpu: Math.random() * 40 + 10,
        memory: Math.random() * 30 + 50,
        disk: Math.random() * 20 + 5,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSort = (column: 'cpu' | 'memory' | 'name') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleEndTask = (processId: string) => {
    closeWindow(processId);
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--window-bg))]">
      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 pt-3 border-b border-border">
        {[
          { id: 'processes', label: 'Processos' },
          { id: 'performance', label: 'Desempenho' },
          { id: 'apps', label: 'Aplicativos' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-[hsl(var(--window-bg))] text-foreground border-t border-x border-border'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'processes' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 bg-[hsl(var(--window-titlebar))] border-b border-border">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Cpu className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{systemStats.cpu.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">CPU</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Activity className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{systemStats.memory.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Memória</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <HardDrive className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{systemStats.disk.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Disco</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-[hsl(var(--window-titlebar))] border-b border-border">
                <tr className="text-sm">
                  <th 
                    className="text-left px-4 py-3 font-medium cursor-pointer hover:bg-muted/30"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Nome
                      <SortIcon column="name" />
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 font-medium w-32">Status</th>
                  <th 
                    className="text-right px-4 py-3 font-medium w-24 cursor-pointer hover:bg-muted/30"
                    onClick={() => handleSort('cpu')}
                  >
                    <div className="flex items-center gap-2 justify-end">
                      CPU
                      <SortIcon column="cpu" />
                    </div>
                  </th>
                  <th 
                    className="text-right px-4 py-3 font-medium w-32 cursor-pointer hover:bg-muted/30"
                    onClick={() => handleSort('memory')}
                  >
                    <div className="flex items-center gap-2 justify-end">
                      Memória
                      <SortIcon column="memory" />
                    </div>
                  </th>
                  <th className="text-right px-4 py-3 font-medium w-24">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sortedProcesses.map((process) => (
                  <motion.tr
                    key={process.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm">{process.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        process.status === 'running' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {process.status === 'running' ? 'Em execução' : 'Suspenso'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span className={process.cpu > 20 ? 'text-orange-500' : ''}>
                        {process.cpu.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {process.memory.toFixed(1)} MB
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!['system', 'desktop', 'explorer'].includes(process.id) && (
                        <button
                          onClick={() => handleEndTask(process.id)}
                          className="px-3 py-1 text-xs rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                        >
                          Finalizar
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'CPU', value: systemStats.cpu, color: 'blue', icon: Cpu },
              { label: 'Memória', value: systemStats.memory, color: 'purple', icon: Activity },
              { label: 'Disco', value: systemStats.disk, color: 'green', icon: HardDrive },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="p-6 rounded-xl border border-border bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                        <Icon className={`w-5 h-5 text-${stat.color}-500`} />
                      </div>
                      <h3 className="font-semibold">{stat.label}</h3>
                    </div>
                    <div className="text-3xl font-bold">{stat.value.toFixed(1)}%</div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-${stat.color}-500`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>Velocidade: 3.2 GHz</div>
                    <div>Núcleos: 8</div>
                    <div>Processos: {processes.length}</div>
                    <div>Threads: {processes.length * 2}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'apps' && (
        <div className="flex-1 p-6 overflow-auto">
          <div className="space-y-3">
            {windows.map((window) => (
              <motion.div
                key={window.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl border border-border bg-card flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <div className="font-medium">{window.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {window.isMinimized ? 'Minimizado' : 'Em execução'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => closeWindow(window.id)}
                  className="px-4 py-2 text-sm rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                >
                  Fechar
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
