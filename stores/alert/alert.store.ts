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
  notificationPermission: 'default', 
  setNotificationPermission: (permission) => set({ notificationPermission: permission }), 
  setToken: (token: string) => set({ token }),
  showHypertensionAlert: false,
  showHypotensionAlert: false,
  setShowHypertensionAlert: (show: boolean) =>
    set({ showHypertensionAlert: show }),
  setShowHypotensionAlert: (show: boolean) =>
    set({ showHypotensionAlert: show }),
});

export const useAlertStore = create<AlertState>()(
  devtools(
    persist(storeApi, {
      name: "alert-storage",
    })
  )
);
