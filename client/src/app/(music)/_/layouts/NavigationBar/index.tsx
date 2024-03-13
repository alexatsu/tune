"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMobile } from "@/music/_/hooks";
import { navigationIcons } from "@/music/_/components/icons/navigation";

import styles from "./styles.module.scss";

const { Music, Search, Albums } = navigationIcons;

const list = [
  {
    path: "/allmusic",
    icon: <Music />,
  },
  {
    path: "/search",
    icon: <Search />,
  },
  {
    path: "/albums",
    icon: <Albums />,
  },
];

function DesktopNavigationBar() {
  const pathname = usePathname();
  const isMobile = useMobile(576);

  if (!isMobile) {
    return (
      <aside>
        <ul className={styles.listDeksktop}>
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
}

function MobileNavigationbar() {
  const pathname = usePathname();
  const isMobile = useMobile(576);
  
  if (isMobile) {
    return (
      <ul className={styles.listMobile}>
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
    );
  }
}

export { DesktopNavigationBar, MobileNavigationbar };
    