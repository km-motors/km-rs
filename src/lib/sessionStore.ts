import { create } from 'zustand';

type SessionState = {
  username: string | null;
  setUser: (username: string) => void;
  clearUser: () => void;
};

export const useSession = create<SessionState>((set) => ({
  username: null,
  setUser: (username) => set({ username }),
  clearUser: () => set({ username: null }),
}));
