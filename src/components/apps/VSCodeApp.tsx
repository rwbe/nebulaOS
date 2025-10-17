import { useState } from 'react';
import { FileText, Folder, Search, Settings } from 'lucide-react';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  content?: string;
}

export const VSCodeApp = () => {
  const [files] = useState<FileItem[]>([
    { name: 'index.tsx', type: 'file', content: 'import React from "react";\n\nfunction App() {\n  return (\n    <div className="App">\n      <h1>Hello NebulaOS!</h1>\n    </div>\n  );\n}\n\nexport default App;' },
    { name: 'styles.css', type: 'file', content: '.App {\n  text-align: center;\n  padding: 20px;\n}\n\nh1 {\n  color: #0078d4;\n}' },
    { name: 'README.md', type: 'file', content: '# Meu Projeto\n\nBem-vindo ao meu projeto NebulaOS!\n\n## Recursos\n- Interface moderna\n- Tema dark/light\n- Totalmente responsivo' },
  ]);
  const [activeFile, setActiveFile] = useState<FileItem>(files[0]);
  const [terminalCommand, setTerminalCommand] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'NebulaOS Terminal [Versão 1.0.0]',
    '(c) Microsoft Corporation. Todos os direitos reservados.',
    '',
  ]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (terminalCommand.trim()) {
      const newOutput = [...terminalOutput, `> ${terminalCommand}`];
      
      if (terminalCommand === 'ls' || terminalCommand === 'dir') {
        newOutput.push(files.map(f => f.name).join('  '));
      } else if (terminalCommand.startsWith('echo ')) {
        newOutput.push(terminalCommand.substring(5));
      } else if (terminalCommand === 'clear') {
        setTerminalOutput([]);
        setTerminalCommand('');
        return;
      } else {
        newOutput.push(`Comando não reconhecido: ${terminalCommand}`);
      }
      
      setTerminalOutput(newOutput);
      setTerminalCommand('');
    }
  };

  return (
    <div className="flex h-full bg-[hsl(var(--window-bg))]">
      {/* Sidebar */}
      <div className="w-64 bg-[hsl(var(--window-titlebar))] border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium mb-2">EXPLORER</h3>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="p-2">
            <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
              <Folder className="w-4 h-4" />
              <span>MEU PROJETO</span>
            </div>
            {files.map(file => (
              <button
                key={file.name}
                onClick={() => setActiveFile(file)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-muted/50 transition-colors ${
                  activeFile.name === file.name ? 'bg-muted' : ''
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{file.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="p-2 border-t border-border flex items-center justify-around">
          <button className="p-2 hover:bg-muted/50 rounded" aria-label="Pesquisar">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-muted/50 rounded" aria-label="Configurações">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <div className="bg-[hsl(var(--window-titlebar))] px-4 py-2 border-b border-border">
            <span className="text-sm">{activeFile.name}</span>
          </div>
          <div className="flex-1 p-4 overflow-auto font-mono text-sm selectable">
            <pre className="text-foreground">{activeFile.content}</pre>
          </div>
        </div>

        {/* Terminal */}
        <div className="h-48 bg-[hsl(var(--window-titlebar))] border-t border-border flex flex-col">
          <div className="px-4 py-2 border-b border-border">
            <span className="text-sm font-medium">TERMINAL</span>
          </div>
          <div className="flex-1 p-4 overflow-auto font-mono text-xs selectable">
            {terminalOutput.map((line, i) => (
              <div key={i} className="text-foreground">{line}</div>
            ))}
          </div>
          <form onSubmit={handleCommand} className="px-4 py-2 flex items-center gap-2 font-mono text-sm border-t border-border">
            <span className="text-primary">{'>'}</span>
            <input
              type="text"
              value={terminalCommand}
              onChange={(e) => setTerminalCommand(e.target.value)}
              placeholder="Digite um comando (ls, echo, clear)"
              className="flex-1 bg-transparent focus:outline-none selectable"
            />
          </form>
        </div>
      </div>
    </div>
  );
};