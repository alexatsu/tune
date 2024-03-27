import Link from "next/link";

import styles from "./styles.module.scss";

export default function Page() {
  return (
    <main className={styles.settingsMain}>
      <section className={styles.text}>
        <h1>Settings</h1>
        <div>
          Coming soon, but for now check out <Link href={"/allmusic"}>Music</Link>
        </div>
      </section>
    </main>
  );
}
