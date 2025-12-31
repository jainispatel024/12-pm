export enum AppMode {
  RETRO = 'RETRO',
  GLITCH = 'GLITCH',
  MODERN = 'MODERN',
}

export interface SystemLog {
  id: string;
  timestamp: string;
  message: string;
}

export interface UserIdentity {
  title: string;
  mission: string;
  element?: string;
}
