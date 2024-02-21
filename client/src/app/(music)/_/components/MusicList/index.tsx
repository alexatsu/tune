"use client";

import React,{ useRef, useState } from "react";
import Image from "next/image";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { useSWRConfig } from "swr";

import { playerIcons } from "@/music/_/components/icons/player";
import { usePlayerContext } from "@/music/_/providers";
import { Song } from "@/music/_/types";

import { usePlayerStore } from "@/shared/store";
import { handleFetch } from "@/shared/utils/functions";

import styles from "./styles.module.scss";

const { Play, Pause, ThreeDots, Add } = playerIcons;

type MusicList = {
  songs: Song[] | undefined;
  session?: Session | null;
};

export function MusicList({ songs, session }: MusicList) {
  const { mutate } = useSWRConfig();
  const pathname = usePathname();
  const { loadPlayerSource, currentSongRef, playerRef } = usePlayerContext();
  const { isPlaying, setIsPlaying, currentSong, setCurrentSong, handlePause } = usePlayerStore();

  const [isAddingSong, setIsAddingSong] = useState(false);
  const currentAddedSongRef = useRef("");

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
    console.log(id, "here is the id");
    setIsAddingSong(true);
    currentAddedSongRef.current = id;

    const userEmail = session?.user?.email;
    const addSongDataToDB = await handleFetch<{ message: string }>(
      "http://localhost:3000/api/songs/add",
      "POST",
      { url, id, title, duration, email: userEmail }
    );

    const saveAndStoreSong = await handleFetch<SaveAndStoreProps>(
      "http://localhost:8000/save-and-store",
      "POST",
      { url, id }
    );
    console.log(saveAndStoreSong, " here is save and store");

    mutate("http://localhost:3000/api/songs/get-all");
    setIsAddingSong(false);
    currentAddedSongRef.current = "";
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

  const renderAddButton = (song: Song) => {
    const ifIsSongID = song.id === currentAddedSongRef.current;
    if (isAddingSong && ifIsSongID) {
      return <div className={styles.loader}/>;
    } else {
      return <Add onClick={() => addSongToMyMusic(song.url, song.id, song.title, song.duration)} />;
    }
  };

  return (
    <div className={styles.musicListContainer}>
      <ul className={styles.musicList}>
        {songs?.map((song) => (
          <React.Fragment key={song.id}>
            <li className={styles.musicListItem} onClick={() => console.log(song)}>
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
                <span className={styles.title}>{song.title}</span>
              </div>

              <div className={styles.rightSection}>
                <span>{song.duration}</span>
                {pathname === "/search" && renderAddButton(song)}
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
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}
