import { useWindows } from '@/contexts/WindowContext';
import { Window } from './Window';

import { BrowserApp } from './apps/BrowserApp';


const appComponents: Record<string, React.ComponentType> = {
  Browser: BrowserApp,
};

export const WindowManager = () => {
  const { windows } = useWindows();

  return (
    <>
      {windows.map(window => {
        const AppComponent = appComponents[window.component];
        
        if (!AppComponent) return null;

        return (
          <Window key={window.id} window={window}>
            <AppComponent />
          </Window>
        );
      })}
    </>
  );
};
