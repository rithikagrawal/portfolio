import { create } from 'zustand';
import { SwitchProfile, sound } from '@/lib/audio';

export type OutputType = 'input' | 'text' | 'error' | 'success' | 'ascii' | 'table' | 'system' | 'custom';

export interface TerminalOutputItem {
  id: string;
  type: OutputType;
  prompt?: string;
  content: string | React.ReactNode;
  timestamp?: number;
}

export type ThemeType = 'amber' | 'matrix' | 'cyber' | 'dracula';
export type ViewMode = 'terminal' | 'gui';
export type GUISection = 'experience' | 'projects' | 'skills' | 'contact' | null;
export type GameType = 'snake' | 'pong' | null;

interface TerminalState {
  outputs: TerminalOutputItem[];
  commandHistory: string[];
  historyIndex: number;
  cwd: string;
  theme: ThemeType;
  soundEnabled: boolean;
  switchProfile: SwitchProfile;
  viewMode: ViewMode;
  activeSection: GUISection;
  isBooting: boolean;
  hasBooted: boolean;
  isMatrixActive: boolean;
  activeGame: GameType;
  isPoweredOn: boolean;

  // Actions
  addOutput: (item: Omit<TerminalOutputItem, 'id' | 'timestamp'>) => void;
  clearOutputs: () => void;
  recordCommand: (cmd: string) => void;
  navigateHistory: (direction: 'up' | 'down') => string | null;
  setCwd: (path: string) => void;
  setTheme: (theme: ThemeType) => void;
  toggleSound: () => boolean;
  setSwitchProfile: (profile: SwitchProfile) => void;
  setViewMode: (mode: ViewMode, section?: GUISection) => void;
  setBooting: (booting: boolean) => void;
  setHasBooted: (booted: boolean) => void;
  setMatrixActive: (active: boolean) => void;
  setActiveGame: (game: GameType) => void;
  togglePower: () => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  outputs: [],
  commandHistory: [],
  historyIndex: -1,
  cwd: '/home/rithik',
  theme: 'amber',
  soundEnabled: true,
  switchProfile: 'blue',
  viewMode: 'terminal',
  activeSection: null,
  isBooting: false,
  hasBooted: false,
  isMatrixActive: false,
  activeGame: null,
  isPoweredOn: true,

  addOutput: (item) => {
    const newItem: TerminalOutputItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    set((state) => ({ outputs: [...state.outputs, newItem] }));
  },

  clearOutputs: () => set({ outputs: [] }),

  recordCommand: (cmd) => {
    if (!cmd.trim()) return;
    set((state) => ({
      commandHistory: [...state.commandHistory, cmd],
      historyIndex: -1,
    }));
  },

  navigateHistory: (direction) => {
    const { commandHistory, historyIndex } = get();
    if (commandHistory.length === 0) return null;

    let newIndex = historyIndex;
    if (direction === 'up') {
      if (historyIndex === -1) {
        newIndex = commandHistory.length - 1;
      } else if (historyIndex > 0) {
        newIndex = historyIndex - 1;
      }
    } else if (direction === 'down') {
      if (historyIndex !== -1) {
        if (historyIndex < commandHistory.length - 1) {
          newIndex = historyIndex + 1;
        } else {
          newIndex = -1;
          set({ historyIndex: -1 });
          return '';
        }
      }
    }

    set({ historyIndex: newIndex });
    return newIndex !== -1 ? commandHistory[newIndex] : '';
  },

  setCwd: (path) => set({ cwd: path }),

  setTheme: (theme) => {
    if (typeof document !== 'undefined') {
      if (theme === 'amber') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', theme);
      }
      localStorage.setItem('term_theme', theme);
    }
    set({ theme });
  },

  toggleSound: () => {
    const current = get().soundEnabled;
    const next = !current;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('term_sound', String(next));
    }
    set({ soundEnabled: next });
    return next;
  },

  setSwitchProfile: (profile) => {
    sound.setSwitchProfile(profile);
    set({ switchProfile: profile });
  },

  setViewMode: (mode, section = null) => {
    set({ viewMode: mode, activeSection: section });
  },

  setBooting: (booting) => set({ isBooting: booting }),
  setHasBooted: (booted) => set({ hasBooted: booted }),
  setMatrixActive: (active) => set({ isMatrixActive: active }),
  setActiveGame: (game) => set({ activeGame: game }),

  togglePower: () => {
    const next = !get().isPoweredOn;
    if (next) {
      sound.playPowerUp();
    } else {
      sound.playPowerDown();
    }
    set({ isPoweredOn: next });
  },
}));
