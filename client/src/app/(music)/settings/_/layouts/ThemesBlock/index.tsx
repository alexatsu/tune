import { ThemesBadge } from "../../components";
import styles from "./styles.module.scss";

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
};

export function ThemesBlock() {
  const { dark, light } = themes;
  return (
    <div className={styles.themesContainer}>
      <h2>Themes</h2>
      <div className={styles.typesBlock}>
        <div className={styles.defaultContainer}>
          <span className={styles.defaultText}>Default</span>
          <ThemesBadge
            bgColor={dark.background}
            widgetColor={dark.widgets}
            accentColor={dark.accent}
            textColor={dark.text}
          />
          <ThemesBadge
            bgColor={light.background}
            widgetColor={light.widgets}
            accentColor={light.accent}
            textColor={light.text}
          />
          <div>color2</div>
        </div>
      </div>
    </div>
  );
}
