import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LoadingScreen } from '@/components/LoadingScreen';
import { LockScreen } from '@/components/LockScreen';
import { LoginScreen } from '@/components/LoginScreen';
import { Desktop } from '@/components/Desktop';
import { WindowProvider } from '@/contexts/WindowContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppearanceProvider } from '@/contexts/AppearanceContext';
import { DesktopProvider } from '@/contexts/DesktopContext';
import { DesktopWindowBridge } from '@/components/DesktopWindowBridge';
import { WidgetsProvider } from '@/contexts/WidgetsContext';

const IndexContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isLocked } = useAuth();

    if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => {}} />;
}
  if (isLocked) {
    return <LockScreen onUnlock={() => {}} />;
  }
  return <Desktop />;
};

const Index = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppearanceProvider>
          <WidgetsProvider>
            <DesktopProvider>
              <WindowProvider>
                <DesktopWindowBridge />
                <IndexContent />
              </WindowProvider>
            </DesktopProvider>
          </WidgetsProvider>
        </AppearanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Index;

