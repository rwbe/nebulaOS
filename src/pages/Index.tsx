import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { LoginScreen } from '@/components/LoginScreen';
import { Desktop } from '@/components/Desktop';
import { WindowProvider } from '@/contexts/WindowContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppearanceProvider } from '@/contexts/AppearanceContext';
import { DesktopProvider } from '@/contexts/DesktopContext';
import { DesktopWindowBridge } from '@/components/DesktopWindowBridge';

const IndexContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

    if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => {}} />;
}
  return <Desktop />;
};

const Index = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppearanceProvider>
            <DesktopProvider>
              <WindowProvider>
                <DesktopWindowBridge />
                <IndexContent />
              </WindowProvider>
            </DesktopProvider>
        </AppearanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Index;

