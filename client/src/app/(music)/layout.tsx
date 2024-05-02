import { PlayerOrChillWrapper } from "./_/components/PlayerOrChillWrapper";
import { DesktopNavigationBar, MobileNavigationbar } from "./_/layouts";
import { ChillStreamerProvider } from "./_/providers/ChillStreamerProvider";
import styles from "./layout.module.scss";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <ChillStreamerProvider>
      <main className={styles.container}>
        <DesktopNavigationBar />
        {children}
      </main>
      <PlayerOrChillWrapper />
      <MobileNavigationbar />
    </ChillStreamerProvider>
  );
}
