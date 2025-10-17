import { useWindows } from '@/contexts/WindowContext';
import { Window } from './Window';

import { BrowserApp } from './apps/BrowserApp';
import { CalculatorApp } from './apps/CalculatorApp';
import { CalendarApp } from './apps/CalendarApp';
import { MailApp } from './apps/MailApp';
import { MusicApp } from './apps/MusicApp';
import { PhotosApp } from './apps/PhotosApp';
import { VSCodeApp } from './apps/VSCodeApp';



const appComponents: Record<string, React.ComponentType> = {
  Browser: BrowserApp,
  Calculator: CalculatorApp,
  Calendar: CalendarApp,
  Mail: MailApp,
  Music: MusicApp,
  Photos: PhotosApp,
  VSCode: VSCodeApp,
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
