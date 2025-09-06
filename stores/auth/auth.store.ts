import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { AuthStatus } from "@/interfaces/auth-status.interface";
import { User } from "@/interfaces/user.interface";

export interface AuthState {
  status: AuthStatus;
  user?: User;
  loginUser: (id: string, email: string) => void;
  logoutUser: () => void;
}

const storeApi: StateCreator<AuthState> = (set) => ({
  status: "unauthenticated",
  user: undefined,
  loginUser: (id: string, email: string) =>
    set({
      status: "authenticated",
      user: { id, email },
    }),
  logoutUser: () => set({ status: "unauthenticated", user: undefined }),
});

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(storeApi, {
      name: "auth-storage",
    })
  )
);
