import { useEffect } from 'react';
import { useWindows } from '@/contexts/WindowContext';
import { useDesktops } from '@/contexts/DesktopContext';

export const DesktopWindowBridge = () => {
  const { registerWindowOpen, registerWindowClose } = useWindows();
  const { addWindowToCurrentDesktop, removeWindowFromDesktops } = useDesktops();

  useEffect(() => {
    const unsubscribeOpen = registerWindowOpen(addWindowToCurrentDesktop);
    const unsubscribeClose = registerWindowClose(removeWindowFromDesktops);
    
    return () => {
      unsubscribeOpen();
      unsubscribeClose();
    };
  }, [registerWindowOpen, registerWindowClose, addWindowToCurrentDesktop, removeWindowFromDesktops]);

  return null;
};
