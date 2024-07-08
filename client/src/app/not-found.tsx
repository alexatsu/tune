import Link from "next/link";

import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <h2>Not Found</h2>
      <p>There is nothing here at the moment</p>
      <p>You can browse through</p>
      <div className={styles.buttonsCluster}>
        <Link href="/allmusic" className={styles.button}>
          Music
        </Link>
        <Link href="/charts" className={styles.button}>
          Charts
        </Link>
      </div>
    </div>
  );
}
