import { useState, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LockScreenProps {
  onUnlock: () => void;
}

const spotlightImages = [
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    title: 'Mountain Vista',
  },
  {
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80',
    title: 'Milky Way',
  },
  {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
    title: 'Forest Path',
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    title: 'Beach Sunset',
  },
  {
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    title: 'Mountain Peak',
  },
];

export const LockScreen = ({ onUnlock }: LockScreenProps) => {
  const { user, unlock } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [time, setTime] = useState(new Date());
  const [currentImage, setCurrentImage] = useState(spotlightImages[0]);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const randomImage = spotlightImages[Math.floor(Math.random() * spotlightImages.length)];
    setCurrentImage(randomImage);
  }, []);

  const handleUnlock = async () => {
    if (!password) {
      setError('Digite sua senha');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsUnlocking(true);
    setError('');

    const success = await unlock(password);
    
    if (success) {
      onUnlock();
    } else {
      setError('Senha incorreta');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setIsUnlocking(false);
      setPassword('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  const formattedTime = time.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedDate = time.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Background image */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${currentImage.url})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </motion.div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-between py-20">
        {/* Time and Date */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-8xl font-light text-white mb-4 tracking-tight">
            {formattedTime}
          </h1>
          <p className="text-2xl text-white/80 capitalize">
            {formattedDate}
          </p>
        </motion.div>

        {/* Login area */}
        <AnimatePresence>
          {!showLogin ? (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.button
                onClick={() => setShowLogin(true)}
                className="text-white/60 hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Lock className="w-12 h-12 mb-4 mx-auto" />
                <p className="text-lg">Clique para desbloquear</p>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              animate-shake={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
              className="w-full max-w-md px-8"
            >
              {/* User info */}
              <div className="flex flex-col items-center mb-8">
                {user?.avatar && (
                  <motion.img
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-4 border-white/20 mb-4 shadow-2xl"
                  />
                )}
                <h2 className="text-2xl font-light text-white mb-1">
                  {user?.name || 'Usuario'}
                </h2>
                <p className="text-sm text-white/60">{user?.email}</p>
              </div>

              {/* Password input */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua senha"
                    className="w-full h-14 pl-12 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all backdrop-blur-md"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Unlock button */}
                <motion.button
                  onClick={handleUnlock}
                  disabled={isUnlocking}
                  className="w-full h-14 bg-white/90 hover:bg-white text-black rounded-xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md"
                  whileHover={{ scale: isUnlocking ? 1 : 1.02 }}
                  whileTap={{ scale: isUnlocking ? 1 : 0.98 }}
                >
                  {isUnlocking ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full"
                    />
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Desbloquear</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image credit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-white/60 text-sm"
        >
          {currentImage.title}
        </motion.div>
      </div>
    </div>
  );
};
