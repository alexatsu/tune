"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";

import { usePlayerContext } from "@/music/_/providers";
import { playerIcons } from "@/music/_/components/icons/player";
import { useSongs } from "@/music/_/hooks";
import { Song } from "@/music/_/types";

import { usePlayerStore } from "@/shared/store";

import styles from "./styles.module.scss";

const { Play, Pause, ThreeDots } = playerIcons;

export function MusicList() {
  const { data: session } = useSession();
  const { isLoading } = useSongs(session);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.main}>
      <Music />
    </div>
  );
}

function Music() {
  const { data: session } = useSession();
  const { songs } = useSongs(session);

  const { loadPlayerSource, currentSongRef: currentTrackRef, playerRef } = usePlayerContext();
  const { isPlaying, setIsPlaying, currentSong, setCurrentSong, handlePause } = usePlayerStore();

  const handlePlayById = (song: Song) => {
    if (currentTrackRef.current?.urlId === song.urlId) {
      playerRef.current?.play();
      setIsPlaying(true);
      return;
    }

    currentTrackRef.current = song;
    setCurrentSong(song);
    loadPlayerSource();
    playerRef.current?.play();
    setIsPlaying(true);
  };

  const renderPlayButton = (song: Song) => {
    const iscurrentTrackRef = song.urlId === currentSong?.urlId;

    const playButton = (
      <div className={styles.notPlaying} onClick={() => handlePlayById(song)}>
        <Play />
      </div>
    );
    const pauseButton = (
      <div className={styles.playing} onClick={() => handlePause(playerRef)}>
        <Pause />
      </div>
    );

    if (isPlaying && iscurrentTrackRef) {
      return pauseButton;
    } else {
      return playButton;
    }
  };

  return (
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
  );
}
