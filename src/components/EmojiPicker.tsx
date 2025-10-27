import { useState } from 'react';
import { Search, Smile, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmojiPickerProps {
  onClose: () => void;
  onSelect?: (emoji: string) => void;
}

const emojiCategories = {
  smileys: {
    name: 'Smileys',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔'],
  },
  gestures: {
    name: 'Gestos',
    emojis: ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
  },
  animals: {
    name: 'Animais',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗'],
  },
  food: {
    name: 'Comida',
    emojis: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔'],
  },
  activities: {
    name: 'Atividades',
    emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷'],
  },
  symbols: {
    name: 'Símbolos',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐'],
  },
};

export const EmojiPicker = ({ onClose, onSelect }: EmojiPickerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('smileys');
  const [recentEmojis, setRecentEmojis] = useState<string[]>(['😀', '👍', '❤️', '🎉']);

  const handleEmojiClick = (emoji: string) => {
    if (!recentEmojis.includes(emoji)) {
      setRecentEmojis([emoji, ...recentEmojis.slice(0, 29)]);
    }
    onSelect?.(emoji);
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="fixed bottom-16 right-4 w-96 h-96 glass-strong rounded-xl shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-3 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar emoji..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 p-2 border-b border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('recent')}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeCategory === 'recent'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-white/5'
            }`}
          >
            <Clock className="w-4 h-4" />
          </button>
          {Object.entries(emojiCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                activeCategory === key
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-white/5'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Emojis */}
        <div className="flex-1 overflow-auto p-3">
          <div className="grid grid-cols-8 gap-1">
            {activeCategory === 'recent'
              ? recentEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmojiClick(emoji)}
                    className="text-2xl p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))
              : emojiCategories[activeCategory as keyof typeof emojiCategories]?.emojis
                  .filter((emoji) => searchQuery === '' || emoji.includes(searchQuery))
                  .map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleEmojiClick(emoji)}
                      className="text-2xl p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};
