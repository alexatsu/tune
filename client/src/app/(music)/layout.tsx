import dynamic from "next/dynamic";

import { DesktopNavigationBar, MobileNavigationbar } from "./_/layouts";
import { StreamProvider } from "./_/providers/StreamProvider";
import styles from "./layout.module.scss";

const Player = dynamic(() => import("./_/layouts/Player").then((module) => module.Player), {
  ssr: false,
});

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <StreamProvider>
      <main className={styles.container}>
        <DesktopNavigationBar />
        {children}
      </main>
      <div className={styles.mobilePlayerAndNavigation}>
        <Player />
        <MobileNavigationbar />
      </div>
    </StreamProvider>
  );
}
