import { Player, Sidebar } from "./_/layouts";
import { PlayerProvider } from "./_/providers";

import styles from "./layout.module.scss";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      <main className={styles.container}>
        <Sidebar />
        {children}
      </main>
      <Player />
    </PlayerProvider>
  );
}
