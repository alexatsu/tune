import { RefObject } from "react";

import styles from "./styles.module.scss";

type TitleProps = {
  isLoading: boolean;
  currentSongRef: RefObject<{
    id: string;
    title: string;
    cover: string;
    url: string;
    duration: string;
    urlId: string;
    addedAt: Date;
    userId: string;
  }>;
};

export function TitleDesktop({ isLoading, currentSongRef }: TitleProps) {
  return (
    <>
      {isLoading && <div className={styles.skeletonTitleDesktop}>Loading</div>}
      {!isLoading && (
        <div className={styles.titleDesktop}>
          {currentSongRef.current?.title || "No song selected"}
        </div>
      )}
    </>
  );
}
