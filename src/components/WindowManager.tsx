import { useWindows } from '@/contexts/WindowContext';
import { Window } from './Window';

import { BrowserApp } from './apps/BrowserApp';
import { CalculatorApp } from './apps/CalculatorApp';
import { CalendarApp } from './apps/CalendarApp';
import { ClockApp } from './apps/ClockApp';
import { FileManagerApp } from './apps/FileManagerApp';
import { MailApp } from './apps/MailApp';
import { MusicApp } from './apps/MusicApp';
import { PaintApp } from './apps/PaintApp';
import { PhotosApp } from './apps/PhotosApp';
import { VSCodeApp } from './apps/VSCodeApp';
import { NotepadApp } from './apps/NotepadApp';
import { StoreApp } from './apps/StoreApp';
import { SettingsApp } from './apps/SettingsApp';
import { TaskManagerApp } from './apps/TaskManagerApp';
import { TerminalApp } from './apps/TerminalApp';


const appComponents: Record<string, React.ComponentType> = {
  Browser: BrowserApp,
  Calculator: CalculatorApp,
  Calendar: CalendarApp,
  Clock: ClockApp,
  FileManager: FileManagerApp,
  Mail: MailApp,
  Music: MusicApp,
  Paint: PaintApp,
  Photos: PhotosApp,
  TaskManager: TaskManagerApp,
  Terminal: TerminalApp,
  VSCode: VSCodeApp,
  Notepad: NotepadApp,
  Store: StoreApp,
  Settings: SettingsApp,
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
