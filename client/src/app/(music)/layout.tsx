import { Player, Sidebar } from "./_/layouts";

import styles from "./layout.module.scss";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={styles.container}>
        <Sidebar />
        {children}
      </div>
      <Player />
    </>
  );
}
