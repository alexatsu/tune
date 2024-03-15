import { DesktopNavigationBar, MobileNavigationbar, Player } from "./_/layouts";
import styles from "./layout.module.scss";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className={styles.container}>
        <DesktopNavigationBar />
        {children}
      </main>
      <Player />
      <MobileNavigationbar />
    </>
  );
}
