"use client";
import styles from "./styles.module.scss";

type ThemesBadgeProps = {
  bgColor?: string;
  widgetColor?: string;
  accentColor?: string;
  textColor?: string;
  applyTheme?: () => void;
};

export function ThemesBadge({
  bgColor,
  widgetColor,
  accentColor,
  textColor,
  applyTheme,
}: ThemesBadgeProps) {
  return (
    <div className={styles.themesBadgeContainer} onClick={applyTheme}>
      <div style={{ background: bgColor }}></div>
      <div style={{ background: widgetColor }}></div>
      <div style={{ background: accentColor }}></div>
      <div style={{ background: textColor }}></div>
    </div>
  );
}
