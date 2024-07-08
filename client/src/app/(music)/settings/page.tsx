import Link from "next/link";

import styles from "./styles.module.scss";

export default function Page() {
  return (
    <div className={styles.settingsMain}>
      <h2 className={styles.title}>Settings</h2>
      <section className={styles.text}>
        <div>
          Coming soon, but for now check out <Link href={"/allmusic"}>Music</Link>
        </div>
      </section>
    </div>
  );
}
