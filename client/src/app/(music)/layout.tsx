import { DesktopNavigationBar, MobileNavigationbar, Player } from "./_/layouts";
import { StreamProvider } from "./_/providers/StreamProvider";
import styles from "./layout.module.scss";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <StreamProvider>
      <main className={styles.container}>
        <DesktopNavigationBar />
        {children}
      </main>
      <Player />
      <MobileNavigationbar />
    </StreamProvider>
  );
}
