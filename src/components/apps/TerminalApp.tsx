import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Minus, Square } from 'lucide-react';
import { motion } from 'framer-motion';

interface CommandHistory {
  command: string;
  output: string[];
  timestamp: Date;
}

export const TerminalApp = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: '',
      output: [
        'NebulaOS Terminal v1.0',
        'Copyright (c) NebulaOS Corporation. Todos os direitos reservados.',
        '',
        'Digite "help" para ver os comandos disponíveis.',
      ],
      timestamp: new Date(),
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState('C:\\Users\\Usuario');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Record<string, (args: string[]) => string[]> = {
    help: () => [
      'Comandos disponíveis:',
      '  help       - Exibe esta mensagem de ajuda',
      '  clear      - Limpa a tela',
      '  echo       - Exibe uma mensagem',
      '  date       - Exibe a data e hora atuais',
      '  whoami     - Exibe informações do usuário',
      '  dir        - Lista arquivos e pastas',
      '  cd         - Navega entre diretórios',
      '  tree       - Exibe estrutura de diretórios',
      '  ipconfig   - Exibe configurações de rede',
      '  ping       - Testa conexão de rede',
      '  calc       - Realiza cálculos simples',
      '  color      - Altera as cores do terminal',
      '  ver        - Exibe a versão do sistema',
    ],
    clear: () => {
      setHistory([]);
      return [];
    },
    echo: (args) => [args.join(' ')],
    date: () => [new Date().toLocaleString('pt-BR')],
    whoami: () => ['Usuario\\NebulaOS'],
    dir: () => [
      'Diretório de ' + currentPath,
      '',
      '24/10/2025  14:30    <DIR>          .',
      '24/10/2025  14:30    <DIR>          ..',
      '20/10/2025  10:15    <DIR>          Documentos',
      '22/10/2025  16:45    <DIR>          Downloads',
      '15/10/2025  09:20    <DIR>          Imagens',
      '18/10/2025  11:30    <DIR>          Música',
      '23/10/2025  14:10         2.847.192 relatório.docx',
      '21/10/2025  13:25         5.234.891 apresentação.pptx',
      '               2 arquivo(s)     8.082.083 bytes',
      '               6 pasta(s)   245.876.543.210 bytes livres',
    ],
    cd: (args) => {
      if (args.length === 0) {
        return [currentPath];
      }
      const newPath = args[0] === '..' 
        ? currentPath.split('\\').slice(0, -1).join('\\') || 'C:\\'
        : currentPath + '\\' + args[0];
      setCurrentPath(newPath);
      return [];
    },
    tree: () => [
      'Listagem de caminhos de pastas',
      'C:.',
      '├───Documentos',
      '│   ├───Trabalho',
      '│   └───Pessoal',
      '├───Downloads',
      '├───Imagens',
      '│   ├───2024',
      '│   └───2025',
      '├───Música',
      '│   ├───Rock',
      '│   └───Pop',
      '└───Vídeos',
    ],
    ipconfig: () => [
      'Configuração de IP do Windows',
      '',
      'Adaptador Ethernet Ethernet0:',
      '   Sufixo DNS específico de conexão. . . . . : ',
      '   Endereço IPv4. . . . . . . . . . . . . . : 192.168.1.100',
      '   Máscara de Sub-rede . . . . . . . . . . . : 255.255.255.0',
      '   Gateway Padrão. . . . . . . . . . . . . . : 192.168.1.1',
    ],
    ping: (args) => {
      const target = args[0] || 'localhost';
      return [
        `Disparando ${target} com 32 bytes de dados:`,
        `Resposta de 192.168.1.1: bytes=32 tempo=1ms TTL=64`,
        `Resposta de 192.168.1.1: bytes=32 tempo=1ms TTL=64`,
        `Resposta de 192.168.1.1: bytes=32 tempo<1ms TTL=64`,
        `Resposta de 192.168.1.1: bytes=32 tempo=1ms TTL=64`,
        '',
        `Estatísticas do Ping para 192.168.1.1:`,
        `    Pacotes: Enviados = 4, Recebidos = 4, Perdidos = 0 (0% de perda),`,
        `Aproximar um número redondo de vezes em milissegundos:`,
        `    Mínimo = 0ms, Máximo = 1ms, Média = 0ms`,
      ];
    },
    calc: (args) => {
      try {
        const expression = args.join(' ');
        const result = eval(expression.replace(/[^0-9+\-*/().]/g, ''));
        return [`${expression} = ${result}`];
      } catch {
        return ['Erro: Expressão inválida'];
      }
    },
    ver: () => [
      'NebulaOS [Versão 1.0.0.2025]',
      '(c) NebulaOS Corporation. Todos os direitos reservados.',
    ],
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setCommandHistory([...commandHistory, trimmedCmd]);
    setHistoryIndex(-1);

    const [command, ...args] = trimmedCmd.split(' ');
    const commandFunc = commands[command.toLowerCase()];

    let output: string[];
    if (commandFunc) {
      output = commandFunc(args);
      if (command.toLowerCase() === 'clear') {
        return;
      }
    } else {
      output = [`'${command}' não é reconhecido como um comando interno ou externo.`];
    }

    setHistory([...history, {
      command: trimmedCmd,
      output,
      timestamp: new Date(),
    }]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const matchingCommands = Object.keys(commands).filter(cmd => 
        cmd.startsWith(input.toLowerCase())
      );
      if (matchingCommands.length === 1) {
        setInput(matchingCommands[0]);
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div 
      className="flex flex-col h-full bg-[#0C0C0C] text-[#CCCCCC] font-mono text-sm overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={terminalRef}
        className="flex-1 overflow-auto p-4 cursor-text"
      >
        {history.map((entry, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            {entry.command && (
              <div className="flex items-start gap-2 mb-1">
                <span className="text-green-400">{currentPath}{'>'}</span>
                <span className="text-white">{entry.command}</span>
              </div>
            )}
            {entry.output.map((line, lineIndex) => (
              <div key={lineIndex} className="mb-1 pl-2">
                {line}
              </div>
            ))}
          </motion.div>
        ))}

        <div className="flex items-start gap-2">
          <span className="text-green-400">{currentPath}{'>'}</span>
          <div className="flex-1 flex">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-white caret-white"
              spellCheck={false}
              autoFocus
            />
            <span className="animate-pulse text-white">▋</span>
          </div>
        </div>
      </div>
    </div>
  );
};
