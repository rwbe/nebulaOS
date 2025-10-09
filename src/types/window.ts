export interface WindowState {
  id: string;
  title: string;
  icon: string;
  component: string;
  isMinimized: boolean;
  isMaximized: boolean;
  isActive: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  component: string;
  isPinned?: boolean;
}
