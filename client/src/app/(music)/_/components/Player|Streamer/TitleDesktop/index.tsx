"use client";
import { usePathname } from "next/navigation";
import { RefObject } from "react";

import styles from "./styles.module.scss";

type TitleProps = {
  isLoading: boolean;
  currentPlayRef: RefObject<{
    id: string;
    title: string;
    cover: string;
    url: string;
    duration?: string;
    urlId?: string;
    addedAt?: Date;
    userId?: string;
  }>;
};

export function TitleDesktop({ isLoading, currentPlayRef }: TitleProps) {
  const pathname = usePathname();
  return (
    <>
      {isLoading && <div className={styles.skeletonTitleDesktop}>Loading</div>}
      {!isLoading && (
        <div className={styles.titleDesktop}>
          {pathname !== "/chill" && (currentPlayRef.current?.title || "No song selected")}
          {pathname === "/chill" && (currentPlayRef.current?.title || "No stream selected")}
        </div>
      )}
    </>
  );
}
