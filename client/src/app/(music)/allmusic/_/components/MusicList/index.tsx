"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useSongs } from "@/music/_/hooks";
import { usePlayerContext } from "@/music/_/providers";
import { playerIcons } from "@/music/_/components/icons/player";

import styles from "./styles.module.scss";
import { Song } from "@/music/_/types";

const { Play, Pause, ThreeDots } = playerIcons;

export function MusicList() {
  const { data: session } = useSession();
  const { isLoading, songs } = useSongs(session);
  const { isPlaying, handlePlayById, handlePause, currentTrack, playerRef } = usePlayerContext();

  const renderPlayButton = (song: Song) => {
    const ifIdIsCurrentTrack = song.urlId === currentTrack?.current?.urlId;

    const playButton = (
      <div className={styles.notPlaying} onClick={() => handlePlayById(song)}>
        <Play />
      </div>
    );
    const pauseButton = (
      <div className={styles.playing} onClick={() => handlePause()}>
        <Pause />
      </div>
    );

    if (isPlaying && ifIdIsCurrentTrack) {
      return pauseButton;
    } else {
      return playButton;
    }
  };
  console.log(playerRef.current?.currentTime, 'here is the current track')
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.main}>
      <ul className={styles.musicList}>
        {songs?.map((song) => (
          <li key={song.urlId} className={styles.musicListItem}>
            <div className={styles.leftSection}>
              <div className={styles.imageBlock}>
                {renderPlayButton(song)}
                <Image
                  src={`http://localhost:8000/audio/saved/${song.urlId}/thumbnail.jpg`}
                  alt={song.title}
                  width={40}
                  height={40}
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>

              <span>{song.title}</span>
            </div>

            <div className={styles.rightSection}>
              <span>{song.duration}</span>
              <ThreeDots />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
