"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationIcons } from "../../components/icons/navigation";

import styles from "./styles.module.scss";

const { Music, Search } = navigationIcons;

const list = [
  {
    path: "/music",
    icon: <Music />,
  },
  {
    path: "/search",
    icon: <Search />,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside>
      <ul className={styles.list}>
        {list.map(({ path, icon }) => {
          const isActive: boolean = path === pathname;
          return (
            <li key={path}>
              <Link href={path} className={isActive ? styles.active : ""}>
                {icon}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
