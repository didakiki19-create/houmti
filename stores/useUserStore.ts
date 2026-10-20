import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '../types';

interface UserState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  toggleTheme: () => void;
  toggleLang: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      toggleTheme: () => set((state) => {
        if (!state.user) return state;
        const newTheme = state.user.theme === 'light' ? 'dark' : 'light';
        const updatedUser = { ...state.user, theme: newTheme };
        
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { user: updatedUser };
      }),
      toggleLang: () => set((state) => {
        if (!state.user) return state;
        const newLang = state.user.lang === 'fr' ? 'ar' : 'fr';
        return { user: { ...state.user, lang: newLang } };
      }),
    }),
    { name: 'hoomty-user-storage' }
  )
);
