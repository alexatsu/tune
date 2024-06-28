"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { SiClyp } from "react-icons/si";

import { navigationIcons } from "@/music/_/components/icons/navigation";
import { useAlbums, useMobile } from "@/music/_/hooks";

import { Album } from "../../types";
import styles from "./styles.module.scss";

const { Music, Search, Albums, Stream, Charts } = navigationIcons;

const list = (pathname: string, currentAlbum: Album | null) => {
  const checkId = pathname.split("/");
  const { gradient, cover } = currentAlbum || {};
  return [
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
      icon: (
        <div style={{ position: "relative" }}>
          <Albums />
          {checkId.length > 2 && (
            <div
              className={styles.currentAlbumBadge}
              style={{ background: cover ? `url(${cover})` : `${gradient}`, borderRadius: "50%" }}
            ></div>
          )}
        </div>
      ),
    },
    {
      path: "/streams",
      icon: <SiClyp color="#515253" size={22} />,
    },
    {
      path: "/charts",
      icon: <Charts />,
    },
  ];
};

function DesktopNavigationBar() {
  const pathname = usePathname();
  const isMobile = useMobile(576);
  const { albums } = useAlbums();

  const findCurrentAlbumId = useCallback(
    (id: string) => {
      const album = albums?.albums.find((album) => album.id === id);
      if (!album) return null;
      return album;
    },
    [albums],
  );

  const currentAlbumId = findCurrentAlbumId(pathname.split("/")[2]);

  if (!isMobile) {
    return (
      <aside>
        <ul className={styles.listDesktop}>
          {list(pathname, currentAlbumId).map(({ path, icon }) => {
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
  const { albums } = useAlbums();
  const findCurrentAlbumId = useCallback(
    (id: string) => {
      const album = albums?.albums.find((album) => album.id === id);
      if (!album) return null;
      return album;
    },
    [albums],
  );

  const currentAlbumId = findCurrentAlbumId(pathname.split("/")[2]);

  if (isMobile) {
    return (
      <ul className={styles.listMobile}>
        {list(pathname, currentAlbumId).map(({ path, icon }) => {
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
