import Link from "next/link";

import styles from "./styles.module.scss";

export function HomeButton() {
  return (
    <Link href={"/"} className={styles.signIn}>
      <div className={styles.btnContainer}>
        <span>Back to home</span>
      </div>
    </Link>
  );
}
