import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800); // pequena pausa ao completar
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#0f0f10] via-[#121213] to-[#1c1c1f] animate-fade-in">
      <div className="flex flex-col items-center gap-10 p-6">
        
        {/* Ícone com brilho e neomorfismo */}
        <div className="relative w-28 h-28 rounded-3xl bg-[#1a1a1d] shadow-[0_0_20px_4px_rgba(255,255,255,0.05)] backdrop-blur-md border border-white/10 animate-pulse-slow">
          <Loader2 className="absolute inset-0 m-auto w-14 h-14 text-white/80 animate-spin-slow drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
        </div>

        {/* Título e descrição */}
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-semibold text-white tracking-wide font-sans">Nebula OS</h1>
          <p className="text-sm text-white/60 tracking-wide font-light">Iniciando sua experiência imersiva...</p>
        </div>

        {/* Barra de progresso estilizada */}
        <div className="relative w-72 h-2 rounded-full bg-white/10 overflow-hidden shadow-inner">
          <div
            className="absolute h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full animate-pulse-fast transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Mensagem opcional de progresso */}
        <p className="text-xs text-white/40 tracking-widest mt-4 uppercase">{Math.floor(progress)}%</p>
      </div>
    </div>
  );
};
