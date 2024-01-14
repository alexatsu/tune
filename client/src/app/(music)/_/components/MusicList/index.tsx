"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useSongs } from "../../hooks";
import { usePlayerContext } from "../../providers";
import { playerIcons } from "../icons/player";

import styles from "./styles.module.scss";
import { Song } from "../../types";

const { Play, Pause, ThreeDots } = playerIcons;

export function MusicList() {
  const { data: session } = useSession();
  const { isLoading, songs } = useSongs(session);
  const { isPlaying, handlePlay, handlePause, currentState } = usePlayerContext();

  const renderPlayButton = (urlId: Song["urlId"]) => {
    const ifIdIsCurrentTrack = urlId === currentState?.urlId;

    if (!isPlaying && !ifIdIsCurrentTrack) {
      return (
        <div className={styles.notPlaying}>
          <Play />
        </div>
      );
    } else if (!isPlaying && ifIdIsCurrentTrack) {
      return (
        <div className={styles.notPlaying}>
          <Play />
        </div>
      );
    } else if (isPlaying && ifIdIsCurrentTrack) {
      return (
        <div className={styles.playing}>
          <Pause />
        </div>
      );
    } else {
      return (
        <div className={styles.notPlaying}>
          <Play />
        </div>
      );
    }
  };

  return (
    <main className={styles.main}>
      <ul className={styles.musicList}>
        {songs?.map(({ urlId, title, duration }) => (
          <li key={urlId} className={styles.musicListItem}>
            <div className={styles.leftSection}>
              <div className={styles.imageBlock}>
                {renderPlayButton(urlId)}
                <Image
                  src={`http://localhost:8000/audio/saved/${urlId}/thumbnail.jpg`}
                  alt={title}
                  width={40}
                  height={40}
                  unoptimized
                />
              </div>

              <span>{title}</span>
            </div>

            <div className={styles.rightSection}>
              <span>{duration}</span>
              <ThreeDots />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
