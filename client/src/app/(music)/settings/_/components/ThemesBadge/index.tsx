import styles from "./styles.module.scss";

type ThemesBadgeProps = {
  bgColor?: string;
  widgetColor?: string;
  accentColor?: string;
  textColor?: string;
};

export function ThemesBadge({ bgColor, widgetColor, accentColor, textColor }: ThemesBadgeProps) {
  return (
    <div className={styles.themesBadgeContainer}>
      <div style={{ background: bgColor }}></div>
      <div style={{ background: widgetColor }}></div>
      <div style={{ background: accentColor }}></div>
      <div style={{ background: textColor }}></div>
    </div>
  );
}
