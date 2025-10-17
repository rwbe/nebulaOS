import { useState, useEffect } from 'react';
import { FiSave, FiDownload, FiUpload, FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter, FiAlignRight } from 'react-icons/fi';
import { toast } from 'sonner';

interface Document {
  name: string;
  content: string;
}

export const NotepadApp = () => {
  const [content, setContent] = useState('');
  const [isSaved, setIsSaved] = useState(true);
  const [fileName, setFileName] = useState('Sem título');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [fontSize, setFontSize] = useState(14);

  useEffect(() => {
    const saved = localStorage.getItem('notepad-content');
    if (saved) {
      setContent(saved);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSaved && content !== localStorage.getItem('notepad-content')) {
        localStorage.setItem('notepad-content', content);
        setIsSaved(true);
        toast.success('Documento salvo automaticamente');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, isSaved]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsSaved(false);
  };

  const handleSave = () => {
    const doc: Document = { name: fileName, content };
    localStorage.setItem('notepad-content', JSON.stringify(doc));
    setIsSaved(true);
    toast.success(`${fileName} salvo com sucesso!`);
  };

  const handleSaveAs = () => {
    const name = prompt('Nome do arquivo:', fileName);
    if (name) {
      setFileName(name);
      const doc: Document = { name, content };
      localStorage.setItem('notepad-content', JSON.stringify(doc));
      setIsSaved(true);
      toast.success(`Salvo como ${name}!`);
    }
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Arquivo exportado!');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setContent(event.target?.result as string);
          setFileName(file.name.replace('.txt', ''));
          setIsSaved(false);
          toast.success('Arquivo importado!');
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const applyFormat = (format: 'bold' | 'italic' | 'underline') => {
    if (format === 'bold') setIsBold(!isBold);
    if (format === 'italic') setIsItalic(!isItalic);
    if (format === 'underline') setIsUnderline(!isUnderline);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content]);

  useEffect(() => {
    const saved = localStorage.getItem('notepad-content');
    if (saved) {
      try {
        const doc: Document = JSON.parse(saved);
        setContent(doc.content);
        setFileName(doc.name);
      } catch {
        setContent(saved);
      }
    }
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b border-border flex flex-col bg-[hsl(var(--window-titlebar))]">
        {/* File Actions */}
        <div className="h-12 flex items-center px-4 gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-[hsl(var(--primary-hover))] transition-colors"
            title="Salvar (Ctrl+S)"
          >
            <FiSave className="w-4 h-4" />
            <span className="text-sm">Salvar</span>
          </button>
          <button
            onClick={handleSaveAs}
            className="px-3 py-1.5 bg-muted rounded-md hover:bg-muted/80 transition-colors text-sm"
          >
            Salvar Como
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md hover:bg-muted/80 transition-colors"
            title="Abrir arquivo"
          >
            <FiUpload className="w-4 h-4" />
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md hover:bg-muted/80 transition-colors"
            title="Exportar"
          >
            <FiDownload className="w-4 h-4" />
          </button>
          <div className="flex-1" />
          <span className="text-xs text-muted-foreground">
            {fileName} • {isSaved ? '✓ Salvo' : '● Modificado'} • {content.length} caracteres
          </span>
        </div>

        {/* Format Toolbar */}
        <div className="h-12 flex items-center px-4 gap-2 border-t border-border">
          <button
            onClick={() => applyFormat('bold')}
            className={`p-2 rounded-md transition-colors ${isBold ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            title="Negrito"
          >
            <FiBold className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyFormat('italic')}
            className={`p-2 rounded-md transition-colors ${isItalic ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            title="Itálico"
          >
            <FiItalic className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyFormat('underline')}
            className={`p-2 rounded-md transition-colors ${isUnderline ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
            title="Sublinhado"
          >
            <FiUnderline className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-border mx-2"></div>
          <button
            onClick={() => setTextAlign('left')}
            className={`p-2 rounded-md transition-colors ${textAlign === 'left' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          >
            <FiAlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTextAlign('center')}
            className={`p-2 rounded-md transition-colors ${textAlign === 'center' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          >
            <FiAlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTextAlign('right')}
            className={`p-2 rounded-md transition-colors ${textAlign === 'right' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
          >
            <FiAlignRight className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-border mx-2"></div>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="px-3 py-1 bg-muted rounded-md text-sm selectable"
          >
            <option value={10}>10</option>
            <option value={12}>12</option>
            <option value={14}>14</option>
            <option value={16}>16</option>
            <option value={18}>18</option>
            <option value={20}>20</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>

      {/* Editor */}
      <textarea
        value={content}
        onChange={handleChange}
        placeholder="Digite seu texto aqui..."
        className="flex-1 p-6 bg-[hsl(var(--window-bg))] resize-none focus:outline-none selectable leading-relaxed"
        style={{
          fontWeight: isBold ? 'bold' : 'normal',
          fontStyle: isItalic ? 'italic' : 'normal',
          textDecoration: isUnderline ? 'underline' : 'none',
          textAlign: textAlign,
          fontSize: `${fontSize}px`,
        }}
      />
    </div>
  );
};