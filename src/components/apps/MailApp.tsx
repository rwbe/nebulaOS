import { useState } from 'react';
import { Search, Mail, Star, Trash, Archive, Send, Paperclip } from 'lucide-react';

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  starred: boolean;
}

const mockEmails: Email[] = [
  {
    id: '1',
    from: 'Microsoft Team',
    subject: 'Bem-vindo a Nebula',
    preview: 'Obrigado por escolher a Nebula. Aqui estão algumas dicas para começar...',
    date: '10:30',
    read: false,
    starred: true,
  },
  {
    id: '2',
    from: 'João Silva',
    subject: 'Reunião de amanhã',
    preview: 'Olá! Gostaria de confirmar nossa reunião para amanhã às 14h...',
    date: '09:15',
    read: false,
    starred: false,
  },
  {
    id: '3',
    from: 'Newsletter Tech',
    subject: 'As últimas notícias de tecnologia',
    preview: 'Confira as novidades mais importantes da semana no mundo tech...',
    date: 'Ontem',
    read: true,
    starred: false,
  },
  {
    id: '4',
    from: 'Maria Santos',
    subject: 'Re: Proposta de projeto',
    preview: 'Obrigada pelo envio da proposta. Vou analisar e te retorno em breve...',
    date: 'Ontem',
    read: true,
    starred: true,
  },
];

export const MailApp = () => {
  const [emails, setEmails] = useState(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [activeFolder, setActiveFolder] = useState('inbox');

  const folders = [
    { id: 'inbox', label: 'Caixa de entrada', icon: Mail, count: 2 },
    { id: 'starred', label: 'Com estrela', icon: Star, count: 2 },
    { id: 'sent', label: 'Enviados', icon: Send, count: 0 },
    { id: 'archive', label: 'Arquivo', icon: Archive, count: 0 },
    { id: 'trash', label: 'Lixeira', icon: Trash, count: 0 },
  ];

  const toggleStar = (id: string) => {
    setEmails(emails.map(email =>
      email.id === id ? { ...email, starred: !email.starred } : email
    ));
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-[hsl(var(--window-titlebar))] border-r border-border p-4">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 mb-4">
          <Send className="w-4 h-4" />
          <span className="font-medium">Novo email</span>
        </button>

        <nav className="space-y-1">
          {folders.map(folder => {
            const Icon = folder.icon;
            return (
              <button
                key={folder.id}
                onClick={() => setActiveFolder(folder.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  activeFolder === folder.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{folder.label}</span>
                </div>
                {folder.count > 0 && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    {folder.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Email List */}
      <div className="w-96 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar emails..."
              className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary selectable"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {emails.map(email => (
            <button
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              className={`w-full p-4 border-b border-border text-left hover:bg-muted/50 transition-colors ${
                selectedEmail?.id === email.id ? 'bg-muted/50' : ''
              } ${!email.read ? 'bg-primary/5' : ''}`}
            >
              <div className="flex items-start justify-between mb-1">
                <span className={`text-sm ${!email.read ? 'font-semibold' : 'font-medium'}`}>
                  {email.from}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{email.date}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(email.id);
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        email.starred ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                </div>
              </div>
              <h4 className={`text-sm mb-1 ${!email.read ? 'font-semibold' : ''}`}>
                {email.subject}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{email.preview}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col">
        {selectedEmail ? (
          <>
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold mb-2">{selectedEmail.subject}</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{selectedEmail.from}</p>
                  <p className="text-xs text-muted-foreground">para mim</p>
                </div>
                <span className="text-sm text-muted-foreground">{selectedEmail.date}</span>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-auto selectable">
              <p className="text-sm leading-relaxed">{selectedEmail.preview}</p>
              <p className="text-sm leading-relaxed mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            <div className="p-4 border-t border-border flex items-center gap-2">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Responder
              </button>
              <button className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg">
                Encaminhar
              </button>
              <button className="p-2 hover:bg-muted rounded-lg ml-auto" aria-label="Anexar">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg" aria-label="Arquivar">
                <Archive className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded-lg" aria-label="Excluir">
                <Trash className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <Mail className="w-16 h-16 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-medium">Selecione um email</h3>
              <p className="text-muted-foreground">Escolha um email da lista para visualizar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};