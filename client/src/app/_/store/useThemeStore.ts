import { create } from "zustand";

import { ThemesProps } from "@/app/(music)/settings/_/layouts/ThemesBlock";

type ThemesStore = {
  currentTheme: string;
  setCurrentTheme: (theme: ThemesProps[keyof ThemesProps], themeName: string) => void;
};

const applyColor = (property: string, color: string) => {
  document.documentElement.style.setProperty(property, color);
};

export const useThemeStore = create<ThemesStore>((set) => ({
  currentTheme: "dark",
  setCurrentTheme: (theme, themeName) => {
    const { background, widgets, accent, text } = theme;
    applyColor(background.prop, background.value);
    applyColor(widgets.prop, widgets.value);
    applyColor(accent.prop, accent.value);
    applyColor(text.prop, text.value);

    set({ currentTheme: themeName });
  },
}));
