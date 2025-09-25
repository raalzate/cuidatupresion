import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface AlertState {
  token: string;
  setToken: (token: string) => void;
  showHypertensionAlert: boolean;
  showHypotensionAlert: boolean;
  notificationPermission: 'default' | 'granted' | 'denied';
  setShowHypertensionAlert: (show: boolean) => void;
  setShowHypotensionAlert: (show: boolean) => void;
  setNotificationPermission: (permission: 'default' | 'granted' | 'denied') => void; 
}

const storeApi: StateCreator<AlertState> = (set) => ({
  token: "",
  showHypertensionAlert: false,
  showHypotensionAlert: false,
  notificationPermission: 'default', 
  
  setToken: (token: string) => set({ token }),
  setShowHypertensionAlert: (show: boolean) =>
    set({ showHypertensionAlert: show }),
  setShowHypotensionAlert: (show: boolean) =>
    set({ showHypotensionAlert: show }),
  setNotificationPermission: (permission) => set({ notificationPermission: permission }), 
});

export const useAlertStore = create<AlertState>()(
  devtools(
    persist(storeApi, {
      name: "alert-storage",
      partialize: (state) => ({ token: state.token }),
    })
  )
);