"use client";

import React, { RefObject, useEffect, useRef, useState } from "react";
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

const formatedDuration = (duration: string) => {
  const [hours, minutes, seconds] = duration.split(":");
  return (
    <span>
      {+hours < 1 ? "" : hours + ":"}
      {minutes && minutes + ":"}
      {+seconds < 10 ? "0" + seconds : seconds}
    </span>
  );
};

const updateProgressBar = (ref: RefObject<HTMLInputElement>, value: string) => {
  ref.current!.style.background = `
  linear-gradient(to right, 
  var(--accent) ${value}%, 
  var(--white-fade) ${value}%)`;
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
      return <div className={styles.loader} />;
    } else {
      return <Add onClick={() => addSongToMyMusic(song.url, song.id, song.title, song.duration)} />;
    }
  };

  return (
    <div className={styles.musicListContainer}>
      <ul className={styles.musicList}>
        {songs?.map((song) => (
          <React.Fragment key={song.id}>
            <li className={styles.musicListItem}>
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
                {formatedDuration(song.duration)}
                {pathname === "/search" && renderAddButton(song)}
                <ThreeDots className={styles.threeDotsMenu} />
              </div>
            </li>

            {pathname === "/search" && <SongPreview song={song} />}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

function SongPreview({ song }: { song: Song }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const bufferRef = useRef<HTMLInputElement | null>(null);
  const [bufferedTime, setBufferedTime] = useState(0);
  
  const trackSeekRef = useRef<HTMLInputElement | null>(null);
  const [seek, setSeek] = useState<number>(0);

  const [isSongPreviewPlaying, setIsSongPreviewPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current?.addEventListener("loadedmetadata", () => {
        console.log("loaded metadata");
      });
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("progress", () => {
        console.log(audio.buffered, "buffered");
        if (audio.buffered.length > 0) {
          setBufferedTime(audio.buffered.end(audio.buffered.length - 1));
          updateProgressBar(bufferRef, `${(bufferedTime / audio.duration) * 100}`);
        }
      });
    }
  }, [bufferedTime]);

  useEffect(() => {
    const updateCurrentTime = setInterval(() => {
      const audio = audioRef.current;

      if (audio?.paused) return;

      if (audio) {
        setSeek(audio.currentTime);
        updateProgressBar(trackSeekRef, `${(audio.currentTime / audio.duration) * 100}`);
      }
    }, 1000);

    return () => clearInterval(updateCurrentTime);
  }, [audioRef]);

  const handleSeekTrack = (event: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = Number(event.target.value);
    const audio = audioRef.current;

    if (audio) {
      audio.currentTime = seekTime;
      updateProgressBar(trackSeekRef, `${(seekTime / audio.duration) * 100}`);
      setSeek(seekTime);
    }
  };

  const previewMute = () => {
    if (!audioRef.current) return;

    if (audioRef.current.muted) {
      audioRef.current.muted = false;
    } else {
      audioRef.current.muted = true;
    }
  };

  const previewPlay = () => {
    audioRef.current?.play();
    setIsSongPreviewPlaying(true);
  };

  const previewPause = () => {
    audioRef.current?.pause();
    setIsSongPreviewPlaying(false);
  };

  const pathname = usePathname();

  return (
    <>
      {pathname === "/search" && (
        <audio
          controls
          src={`http://localhost:8000/stream?url=${song.url}`}
          preload={"metadata"}
          ref={audioRef}
        />
      )}
      {isSongPreviewPlaying ? <Pause onClick={previewPause} /> : <Play onClick={previewPlay} />}
      <button onClick={previewMute}>mute</button>
      <div className={styles.inputs}>
        <input
          className={styles.trackSeek}
          ref={trackSeekRef}
          type="range"
          min={0}
          value={seek}
          onChange={handleSeekTrack}
          max={audioRef.current?.duration}
        />
        <input
          className={styles.buffer}
          ref={bufferRef}
          type="range"
          min={0}
          defaultValue={bufferedTime}
          max={audioRef.current?.duration}
        />
      </div>
    </>
  );
}
