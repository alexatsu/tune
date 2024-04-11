import styles from "./styles.module.scss";

export function PlayerContainerDesktop({ children }: { children: React.ReactNode }) {
  return <div className={styles.desktopPlayerContainer}>{children}</div>;
}
