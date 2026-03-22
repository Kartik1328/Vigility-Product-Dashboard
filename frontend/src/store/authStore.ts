import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types";
import { clearFilterCookies } from "../utils/cookies";

interface AuthState {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      login: (token, user) => set({ token, user }),

      logout: () => {
        clearFilterCookies();
        set({ token: null, user: null });
      },

      isAuthenticated: () => !!get().token,
    }),
    {
      name: "vigility_auth", // persisted in localStorage
    },
  ),
);
