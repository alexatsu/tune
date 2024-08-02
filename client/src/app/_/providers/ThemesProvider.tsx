"use client";
import { useSession } from "next-auth/react";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { handleFetch } from "../utils/functions";

export type ThemesProps = {
  [key: string]: Theme;
};

export type Theme = {
  background: string;
  widgets: string;
  accent: string;
  text: string;
};

type ThemesContext = {
  themes: ThemesProps;
  currentTheme: Theme | null;
  setCurrentTheme: Dispatch<SetStateAction<Theme | null>>;
  handleTheme: (theme: ThemesProps[keyof ThemesProps]) => void;
};

export type ThemesResponse = {
  themes: {
    currentTheme: Theme;
    customThemes: Theme[];
    quickAccessThemes: Theme[];
  };
  message: string;
};

const themes = {
  dark: {
    background: "#121313",
    widgets: "#1a1e1f",
    accent: "#76efff",
    text: "#ececec",
  },
  light: {
    background: "#dfdfdf",
    widgets: "#1a1e1f",
    accent: "#ffc1e6",
    text: "#ececec",
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

function ThemesProvider({
  children,
  themesFromDB,
  currentThemeFromCookies,
}: {
  children: React.ReactNode;
  themesFromDB: ThemesResponse;
  currentThemeFromCookies?: Theme | null;
}) {
  const isThemes = themesFromDB.themes;
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const { data: session } = useSession();
  const updaterThemeForDBRef = useRef<Theme | null>(null);

  useEffect(() => {
    if (isThemes) {
      applyTheme(isThemes.currentTheme);
      setCurrentTheme(isThemes.currentTheme);
    } else {
      applyTheme(themes.dark);
      setCurrentTheme(themes.dark);
    }
  }, [isThemes, currentThemeFromCookies]);

  const updateCurrentThemeInDB = async () => {
    const url = "/api/settings/themes/update-current-theme";
    const response = await handleFetch(url, "PUT", {
      session,
      currentTheme: updaterThemeForDBRef.current,
    });
    return response;
  };

  const applyTheme = (theme: ThemesProps[keyof ThemesProps]) => {
    const { background, widgets, accent, text } = theme;
    const props = ["--bg", "--widget-bg", "--accent", "--text"];
    const values = [background, widgets, accent, text];

    for (let i = 0; i < props.length; i++) {
      applyColor(props[i], values[i]);
    }
  };

  const handleTheme = (theme: ThemesProps[keyof ThemesProps]) => {
    const { background, widgets, accent, text } = theme;

    setCurrentTheme({ background, widgets, accent, text });
    applyTheme(theme);
    updaterThemeForDBRef.current = theme;
    updateCurrentThemeInDB();
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
