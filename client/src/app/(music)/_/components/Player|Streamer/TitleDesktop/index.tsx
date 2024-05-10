"use client";
import { usePathname } from "next/navigation";
import { MutableRefObject, RefObject } from "react";

import { Song } from "../../../types";
import styles from "./styles.module.scss";

type TitleProps = {
  isLoading: boolean;
  currentPlayRef: MutableRefObject<Song | null>;
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
