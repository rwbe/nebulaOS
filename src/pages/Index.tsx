import { useState } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Desktop } from '@/components/Desktop';
import { WindowProvider } from '@/contexts/WindowContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppearanceProvider } from '@/contexts/AppearanceContext';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ThemeProvider>
      <AppearanceProvider>
        <WindowProvider>
        {isLoading ? (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        ) : (
          <Desktop />
        )}
        </WindowProvider>
      </AppearanceProvider>
    </ThemeProvider>
  );
};

export default Index;
