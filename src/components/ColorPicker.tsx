import { useState } from 'react';
import { Pipette, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ColorPickerProps {
  onClose: () => void;
  onSelect?: (color: string) => void;
}

export const ColorPicker = ({ onClose, onSelect }: ColorPickerProps) => {
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [copiedColor, setCopiedColor] = useState(false);

  const presetColors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', 
    '#8B5CF6', '#EC4899', '#F43F5E', '#14B8A6', '#06B6D4',
    '#84CC16', '#EAB308', '#F97316', '#DC2626', '#65A30D',
    '#16A34A', '#0891B2', '#0284C7', '#4F46E5', '#7C3AED',
    '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB',
    '#E5E7EB', '#F3F4F6', '#FFFFFF', '#FEF3C7', '#DBEAFE',
  ];

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    onSelect?.(color);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedColor);
    setCopiedColor(true);
    setTimeout(() => setCopiedColor(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="fixed bottom-16 right-4 w-80 glass-strong rounded-xl shadow-2xl z-50 flex flex-col p-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Pipette className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Color Picker</h3>
          </div>
        </div>

        {/* Current Color Display */}
        <div className="mb-4">
          <div
            className="w-full h-24 rounded-lg border-2 border-white/20 shadow-inner mb-2"
            style={{ backgroundColor: selectedColor }}
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {copiedColor ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Color Picker Input */}
        <div className="mb-4">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => handleColorClick(e.target.value)}
            className="w-full h-12 rounded-lg cursor-pointer"
          />
        </div>

        {/* Preset Colors */}
        <div>
          <h4 className="text-sm font-medium mb-2">Cores Predefinidas</h4>
          <div className="grid grid-cols-10 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorClick(color)}
                className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                  selectedColor === color
                    ? 'border-white shadow-lg scale-110'
                    : 'border-white/20'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* RGB/HSL Info */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg text-xs font-mono space-y-1">
          <div>HEX: {selectedColor.toUpperCase()}</div>
          <div className="text-muted-foreground">
            Clique em uma cor ou use o seletor acima
          </div>
        </div>
      </motion.div>
    </>
  );
};
