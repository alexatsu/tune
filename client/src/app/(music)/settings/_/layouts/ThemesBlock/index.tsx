"use client";
import { useThemeStore } from "@/app/_/store/useThemeStore";

import { ThemesBadge } from "../../components";
import styles from "./styles.module.scss";

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

export function ThemesBlock() {
  const { currentTheme, setCurrentTheme } = useThemeStore();

  const renderThemeBadges = () => {
    return Object.entries(themes).map(([key, theme]) => {
      const { background, widgets, accent, text } = theme;
      return (
        <ThemesBadge
          key={key}
          bgColor={background.value}
          widgetColor={widgets.value}
          accentColor={accent.value}
          textColor={text.value}
          applyTheme={() => setCurrentTheme(theme, key)}
        />
      );
    });
  };

  return (
    <div className={styles.themesContainer}>
      <h2>Themes</h2>
      <div className={styles.typesBlock}>
        <div className={styles.defaultContainer}>
          <span className={styles.defaultText}>Default:</span>
          {renderThemeBadges()}
          current theme: {currentTheme}
        </div>
      </div>
    </div>
  );
}
