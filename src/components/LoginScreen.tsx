import { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Preencha todos os campos');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    
    if (success) {
      onLogin();
    } else {
      setError('Senha deve ter no mínimo 4 caracteres');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated background */}
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

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md px-8"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl border border-white/10 flex items-center justify-center mb-6">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="w-4 h-4 bg-gradient-to-br from-white to-gray-300 rounded-sm" />
              <div className="w-4 h-4 bg-gradient-to-br from-white to-gray-300 rounded-sm" />
              <div className="w-4 h-4 bg-gradient-to-br from-white to-gray-300 rounded-sm" />
              <div className="w-4 h-4 bg-gradient-to-br from-white to-gray-300 rounded-sm" />
            </div>
          </div>
          <h1 className="text-4xl font-light text-white tracking-wider mb-2">
            Nebula<span className="font-semibold">OS</span>
          </h1>
          <p className="text-sm text-white/60">Bem-vindo de volta</p>
        </motion.div>

        {/* Login form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          animate-shake={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-4"
        >
          {/* User input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 z-10 pointer-events-none">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Usuário"
              className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all backdrop-blur-sm relative z-0"
              autoFocus
            />
          </div>

          {/* Password input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 z-10 pointer-events-none">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Senha"
              className="w-full h-14 pl-12 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all backdrop-blur-sm relative z-0"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors z-10"
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

          {/* Login button */}
          <motion.button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-14 bg-white text-black rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full"
              />
            ) : (
              <>
                <span>Entrar</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>

          {/* Footer */}
          <div className="text-center text-xs text-white/40 mt-8">
            <p>Use qualquer email e uma senha de 4+ caracteres</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 text-center"
      >
        <p className="text-xs text-white/30 tracking-widest uppercase">
          NebulaOS v1.0
        </p>
      </motion.div>
    </div>
  );
};
