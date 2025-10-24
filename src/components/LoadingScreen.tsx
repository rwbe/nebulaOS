import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Iniciando');
  const [isExiting, setIsExiting] = useState(false);

  const loadingStages = [
    { threshold: 0, text: 'Iniciando' },
    { threshold: 20, text: 'Carregando recursos' },
    { threshold: 40, text: 'Preparando interface' },
    { threshold: 60, text: 'Configurando sistema' },
    { threshold: 80, text: 'Quase pronto' },
    { threshold: 95, text: 'Finalizando' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExiting(true);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const currentStage = [...loadingStages]
      .reverse()
      .find(stage => progress >= stage.threshold);
    if (currentStage) {
      setLoadingText(currentStage.text);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black"
        >
          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }} />
          </div>

          {/* Animated glow orbs */}
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-purple-500/10 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />

          {/* Main content */}
          <div className="relative flex flex-col items-center gap-12 p-8">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              {/* Outer ring with rotation */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-32 h-32 rounded-full border-2 border-white/10"
              />
              
              {/* Middle ring with counter rotation */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 w-28 h-28 rounded-full border border-white/20"
              />

              {/* Logo center */}
              <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl shadow-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center">
                {/* NebulaOS icon - Windows style logo */}
                <div className="relative w-16 h-16">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-white to-gray-300 rounded-sm" />
                    <div className="w-6 h-6 bg-gradient-to-br from-white to-gray-300 rounded-sm" />
                    <div className="w-6 h-6 bg-gradient-to-br from-white to-gray-300 rounded-sm" />
                    <div className="w-6 h-6 bg-gradient-to-br from-white to-gray-300 rounded-sm" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center space-y-2"
            >
              <h1 className="text-5xl font-light text-white tracking-wider">
                Nebula<span className="font-semibold">OS</span>
              </h1>
              <motion.p
                key={loadingText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-white/60 tracking-wide"
              >
                {loadingText}
              </motion.p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="w-80 space-y-3"
            >
              {/* Progress bar container */}
              <div className="relative h-1 rounded-full bg-white/10 overflow-hidden shadow-inner">
                <motion.div
                  className="absolute h-full bg-gradient-to-r from-gray-400 via-white to-gray-400 rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </motion.div>
              </div>

              {/* Progress percentage */}
              <div className="flex items-center justify-between text-xs text-white/40">
                <span className="tracking-widest">{Math.floor(progress)}%</span>
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="tracking-widest"
                >
                  •••
                </motion.span>
              </div>
            </motion.div>

            {/* Footer hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="text-xs text-white/30 tracking-widest uppercase mt-8"
            >
              Designed for the modern web
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
