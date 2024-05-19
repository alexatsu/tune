"use client";
import { usePathname } from "next/navigation";
import { MutableRefObject, RefObject } from "react";

import { Stream } from "@/music/_/types";

import { Song } from "../../../types";
import styles from "./styles.module.scss";

type TitleProps = {
  currentPlayRef: MutableRefObject<Song | Stream | null> | MutableRefObject<Stream | null>;
};

export function TitleDesktop({ currentPlayRef }: TitleProps) {
  const pathname = usePathname();
  return (
    <>
      {/* {isLoading && <div className={styles.skeletonTitleDesktop}>Loading</div>} */}
      <div className={styles.titleDesktop}>
        {pathname !== "/streams" && (currentPlayRef.current?.title || "No song selected")}
        {pathname === "/streams" && (currentPlayRef.current?.title || "No stream selected")}
      </div>
    </>
  );
}
