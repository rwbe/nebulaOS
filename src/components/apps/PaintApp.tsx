import { useState, useRef, useEffect } from 'react';
import { 
  Pencil, Eraser, Circle, Square, Type, 
  Download, Trash2, Undo, Redo, Palette,
  Pipette, Minus
} from 'lucide-react';
import { motion } from 'framer-motion';

export const PaintApp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pencil' | 'eraser' | 'line' | 'circle' | 'square' | 'text'>('pencil');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
  ];

 type ToolType = 'pencil' | 'eraser' | 'line' | 'circle' | 'square' | 'text';

interface ToolItem {
  id: ToolType;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const tools: ToolItem[] = [
  { id: 'pencil', label: 'Lápis', icon: Pencil },
  { id: 'eraser', label: 'Borracha', icon: Eraser },
  { id: 'line', label: 'Linha', icon: Minus },
  { id: 'circle', label: 'Círculo', icon: Circle },
  { id: 'square', label: 'Quadrado', icon: Square },
  { id: 'text', label: 'Texto', icon: Type },
];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPos({ x, y });
    setIsDrawing(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 3 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'line') {
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (tool === 'square') {
      ctx.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
    }

    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'paint-image.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--window-bg))]">
      {/* Toolbar */}
      <div className="h-14 border-b border-border bg-[hsl(var(--window-titlebar))] flex items-center px-4 gap-3">
        {/* Tools */}
        <div className="flex items-center gap-1">
          {tools.map((toolItem) => {
            const Icon = toolItem.icon;
            return (
              <button
                key={toolItem.id}
                onClick={() => setTool(toolItem.id)}
                className={`p-2 rounded-lg transition-colors ${
                  tool === toolItem.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
                title={toolItem.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Colors */}
        <div className="flex items-center gap-1">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded border-2 transition-all ${
                color === c ? 'border-primary scale-110' : 'border-border'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-6 rounded cursor-pointer"
          />
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Line Width */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Espessura:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-xs w-6">{lineWidth}px</span>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Desfazer">
            <Undo className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Refazer">
            <Redo className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button
            onClick={clearCanvas}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Limpar tudo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={downloadImage}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Salvar"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto p-4 bg-muted/10">
        <div className="w-full h-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={1200}
            height={800}
            className="bg-white shadow-lg cursor-crosshair rounded-lg"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>
    </div>
  );
};
