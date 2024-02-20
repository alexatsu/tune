"use client";

import Image from "next/image";
import { useSWRConfig } from "swr";

import { usePlayerContext } from "@/music/_/providers";
import { playerIcons } from "@/music/_/components/icons/player";
import { Song } from "@/music/_/types";

import { usePlayerStore } from "@/shared/store";

import styles from "./styles.module.scss";
import { handleFetch } from "@/shared/utils/functions";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";

const { Play, Pause, ThreeDots, Add } = playerIcons;

type MusicList = {
  songs: Song[] | undefined;
  session?: Session | null;
};

export function MusicList({ songs, session }: MusicList) {
  console.log(songs, " here is the songs in musiclist search");
  const { mutate } = useSWRConfig();
  const pathname = usePathname();
  const { loadPlayerSource, currentSongRef, playerRef } = usePlayerContext();
  const { isPlaying, setIsPlaying, currentSong, setCurrentSong, handlePause, handlePlay } =
    usePlayerStore();

  const handlePlayById = (song: Song) => {
    if (currentSongRef.current?.urlId === song.urlId) {
      playerRef.current?.play();
      setIsPlaying(true);
      return;
    }

    currentSongRef.current = song;
    setCurrentSong(song);
    loadPlayerSource();
    playerRef.current?.play();
    setIsPlaying(true);
  };

  const addSongToMyMusic = async (url: string, id: string, title: string, duration: string) => {
    type SaveAndStoreProps = {
      message: string;
      metadata: {
        url: string;
        id: string;
        title: string;
        duration: string;
      };
      error: string;
    };

    const saveAndStoreSong = await handleFetch<SaveAndStoreProps>(
      "http://localhost:8000/save-and-store",
      "POST",
      { url, id }
    );

    const userEmail = session?.user?.email;

    const addSongDataToDB = await handleFetch<{ message: string }>(
      "http://localhost:3000/api/songs/add",
      "POST",
      { url, id, title, duration, email: userEmail }
    );

    mutate("http://localhost:3000/api/songs/get-all");
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
    <div className={styles.container}>
      <ul className={styles.musicList}>
        {songs?.map((song) => (
          <>
            <li key={song.id} className={styles.musicListItem}>
              <div className={styles.leftSection}>
                <div className={styles.imageBlock}>
                  {pathname !== "/search" && renderPlayButton(song)}
                  <Image
                    src={
                      pathname === "/search"
                        ? song.cover
                        : `http://localhost:8000/audio/saved/${song.urlId}/thumbnail.jpg`
                    }
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

                {pathname === "/search" && (
                  <Add
                    onClick={() => addSongToMyMusic(song.url, song.id, song.title, song.duration)}
                  />
                )}

                <ThreeDots />
              </div>
            </li>
            {pathname === "/search" && (
              <audio
                controls
                src={`http://localhost:8000/stream?url=${song.url}`}
                preload={"metadata"}
              />
            )}
          </>
        ))}
      </ul>
    </div>
  );
}
