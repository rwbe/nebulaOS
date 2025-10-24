import { useState } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Desktop } from '@/components/Desktop';
import { WindowProvider } from '@/contexts/WindowContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppearanceProvider } from '@/contexts/AppearanceContext';
import { DesktopProvider } from '@/contexts/DesktopContext';
import { DesktopWindowBridge } from '@/components/DesktopWindowBridge';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ThemeProvider>
      <AppearanceProvider>
        <DesktopProvider>
          <WindowProvider>
           <DesktopWindowBridge />
        {isLoading ? (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        ) : (
          <Desktop />
        )}
         </WindowProvider>
        </DesktopProvider>
      </AppearanceProvider>
    </ThemeProvider>
  );
};

export default Index;
