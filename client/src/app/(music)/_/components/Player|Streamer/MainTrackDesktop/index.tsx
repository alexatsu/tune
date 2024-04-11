import styles from "./styles.module.scss";

export function MainTrackDesktop({ children }: { children: React.ReactNode }) {
  return <div className={styles.mainTrackDesktop}>{children}</div>;
}
