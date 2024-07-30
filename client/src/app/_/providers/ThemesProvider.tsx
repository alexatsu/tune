"use client";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type ColorProp = {
  prop: string;
  value: string;
};

export type ThemesProps = {
  [key: string]: {
    background: ColorProp;
    widgets: ColorProp;
    accent: ColorProp;
    text: ColorProp;
  };
};

type Theme = {
  background: ColorProp;
  widgets: ColorProp;
  accent: ColorProp;
  text: ColorProp;
};

type ThemesContext = {
  themes: ThemesProps;
  currentTheme: Theme;
  setCurrentTheme: Dispatch<SetStateAction<Theme>>;
  handleTheme: (theme: ThemesProps[keyof ThemesProps]) => void;
};

const themes = {
  dark: {
    background: { prop: "--bg", value: "#121313" },
    widgets: { prop: "--widget-bg", value: "#1a1e1f" },
    accent: { prop: "--accent", value: "#76efff" },
    text: { prop: "--text", value: "#ececec" },
  },
  light: {
    background: { prop: "--bg", value: "#dfdfdf" },
    widgets: { prop: "--widget-bg", value: "#1a1e1f" },
    accent: { prop: "--accent", value: "#ffc1e6" },
    text: { prop: "--text", value: "#ececec" },
  },
} as ThemesProps;

const applyColor = (property: string, color: string) => {
  document.documentElement.style.setProperty(property, color);
};

const ThemesContext = createContext<ThemesContext | null>(null);

function useThemesContext() {
  const context = useContext(ThemesContext);

  if (!context) {
    throw new Error("useThemesContext must be used within a ThemesProvider");
  }

  return context;
}

function ThemesProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState(themes.dark);

  const storeThemeInLocalStorage = (theme: ThemesProps[keyof ThemesProps]) => {
    localStorage.setItem("theme", JSON.stringify(theme));
  };

  const handleTheme = (theme: ThemesProps[keyof ThemesProps]) => {
    const { background, widgets, accent, text } = theme;

    setCurrentTheme({ background, widgets, accent, text });

    applyColor(background.prop, background.value);
    applyColor(widgets.prop, widgets.value);
    applyColor(accent.prop, accent.value);
    applyColor(text.prop, text.value);

    storeThemeInLocalStorage(theme);
  };

  const values: ThemesContext = {
    themes,
    currentTheme,
    setCurrentTheme,
    handleTheme,
  };

  return <ThemesContext.Provider value={values}>{children}</ThemesContext.Provider>;
}

export { ThemesProvider, useThemesContext };
