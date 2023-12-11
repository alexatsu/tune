import Link from "next/link";

import { MenuDropdown } from "../../components";

import styles from "./styles.module.scss";

export function Header() {
  return (
    <header className={styles.header}>
      <Link href={"/"} className={styles.logo}>
        <h1>Tune</h1>
      </Link>

      <MenuDropdown />
    </header>
  );
}
