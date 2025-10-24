import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  lastLogin?: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLocked: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  lock: () => void;
  unlock: (password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'nebulaos_auth';
const LOCK_KEY = 'nebulaos_locked';

const simpleHash = async (text: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const passwordHashRef = useRef<string | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    const lockStatus = localStorage.getItem(LOCK_KEY);
    
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setUser(authData.user);
        passwordHashRef.current = authData.passwordHash;
      } catch (error) {
        console.error('Failed to parse auth data:', error);
      }
    }

    if (lockStatus === 'true') {
      setIsLocked(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (password.length < 4) {
      return false;
    }

    return new Promise((resolve) => {
      setTimeout(async () => {
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0] || 'Usuario',
          email: email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=3B82F6&color=fff`,
          lastLogin: new Date(),
        };
        
        const passwordHash = await simpleHash(password);
        passwordHashRef.current = passwordHash;
        
        setUser(newUser);
        setIsLocked(false);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: newUser, passwordHash }));
        localStorage.setItem(LOCK_KEY, 'false');
        resolve(true);
      }, 1500);
    });
  };

  const logout = () => {
    setUser(null);
    setIsLocked(false);
    passwordHashRef.current = null;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LOCK_KEY);
  };

  const lock = () => {
    setIsLocked(true);
    localStorage.setItem(LOCK_KEY, 'true');
  };

  const unlock = async (password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        if (!passwordHashRef.current) {
          resolve(false);
          return;
        }

        const inputHash = await simpleHash(password);
        if (inputHash === passwordHashRef.current) {
          setIsLocked(false);
          localStorage.setItem(LOCK_KEY, 'false');
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLocked,
      login,
      logout,
      lock,
      unlock,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
