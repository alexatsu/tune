"use client";
import { useThemesContext } from "@/app/_/providers";

import { ThemesBadge } from "../../components";
import styles from "./styles.module.scss";

export function ThemesBlock() {
  const { themes, currentTheme, handleTheme } = useThemesContext();

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
          applyTheme={() => handleTheme(theme)}
        />
      );
    });
  };

  return (
    <div className={styles.themesContainer}>
      <h2>Themes</h2>
      <div className={styles.typesBlock}>
        <p className={styles.themesDecsription}>
          Theme colors in order: 1 - Background, 2 - Widgets, 3 - Accent, 4 - Text
        </p>
        <div className={styles.defaultContainer}>
          <span className={styles.defaultText}>Default:</span>
          {renderThemeBadges()}
        </div>

        <div className={styles.currentContainer}>
          <span>Current:</span>
          <ThemesBadge
            bgColor={currentTheme.background.value}
            widgetColor={currentTheme.widgets.value}
            accentColor={currentTheme.accent.value}
            textColor={currentTheme.text.value}
          />
        </div>
      </div>
    </div>
  );
}
