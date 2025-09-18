import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface AlertState {
  showHypertensionAlert: boolean;
  showHypotensionAlert: boolean;
  setShowHypertensionAlert: (show: boolean) => void;
  setShowHypotensionAlert: (show: boolean) => void;
}

const storeApi: StateCreator<AlertState> = (set) => ({
  showHypertensionAlert: false,
  showHypotensionAlert: true,
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
