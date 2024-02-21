import { Player, NavigationBar } from "./_/layouts";
import { PlayerProvider } from "./_/providers";

import styles from "./layout.module.scss";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      <main className={styles.container}>
        <NavigationBar />
        {children}
      </main>
      <Player />
    </PlayerProvider>
  );
}
