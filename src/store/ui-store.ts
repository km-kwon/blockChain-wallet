import { create } from "zustand";

type ThemeMode = "light" | "dark";

type UiState = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  theme: "light",
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),
}));
