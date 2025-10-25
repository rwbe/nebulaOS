import { useState } from 'react';
import { Plus, Trash2, X, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
  id: string;
  content: string;
  color: string;
  position: { x: number; y: number };
}

export const StickyNotesApp = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Bem-vindo ao Notas Rápidas! Clique para editar.',
      color: '#FEF3C7',
      position: { x: 20, y: 20 },
    },
  ]);

  const colors = [
    '#FEF3C7', // Yellow
    '#DBEAFE', // Blue
    '#DCFCE7', // Green
    '#FCE7F3', // Pink
    '#E0E7FF', // Purple
    '#FED7AA', // Orange
  ];

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: 'Nova nota...',
      color: colors[Math.floor(Math.random() * colors.length)],
      position: { x: Math.random() * 100 + 20, y: Math.random() * 100 + 20 },
    };
    setNotes([...notes, newNote]);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const updateNote = (id: string, content: string) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, content } : note)));
  };

  const changeColor = (id: string, color: string) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, color } : note)));
  };

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--window-bg))]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Notas Rápidas</h2>
        <button
          onClick={addNote}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Nota
        </button>
      </div>

      {/* Notes */}
      <div className="flex-1 overflow-auto p-4">
        <AnimatePresence>
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p>Nenhuma nota ainda</p>
              <p className="text-sm">Clique em "Nova Nota" para começar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  style={{ backgroundColor: note.color }}
                  className="p-4 rounded-lg shadow-lg relative group min-h-[200px]"
                >
                  {/* Color picker */}
                  <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => changeColor(note.id, color)}
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>

                  {/* Content */}
                  <textarea
                    value={note.content}
                    onChange={(e) => updateNote(note.id, e.target.value)}
                    className="w-full h-full mt-8 bg-transparent border-none outline-none resize-none text-gray-800 placeholder:text-gray-500"
                    placeholder="Digite aqui..."
                    style={{ fontFamily: 'Caveat, cursive', fontSize: '18px' }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
