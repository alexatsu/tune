import Link from "next/link";

import { MenuDropdown } from "@/app/_/components/MenuDropdown";
import { Menu } from "@/app/_/components/icons";

import { MenuProps } from "./MenuProps/MenuProps";
import styles from "./styles.module.scss";

export function Header() {
  return (
    <header className={styles.header}>
      <Link href={"/"} className={styles.logo}>
        <h1>Tune</h1>
      </Link>

      <MenuDropdown props={<MenuProps />} Icon={<Menu />} />
    </header>
  );
}
