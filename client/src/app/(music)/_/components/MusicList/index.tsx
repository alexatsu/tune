"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import React, { useEffect, useRef, useState } from "react";
import { useSWRConfig } from "swr";

import { MenuDropdown } from "@/app/_/components/MenuDropdown";
import { playerIcons } from "@/music/_/components/icons/player";
import { usePlayer, useSearch, useSongs } from "@/music/_/hooks";
import { usePlayerContext } from "@/music/_/providers";
import { Song, SongsResponse } from "@/music/_/types";
import { updateProgressBar } from "@/music/_/utils/functions";
import { usePlayerStore } from "@/shared/store";
import { handleFetch } from "@/shared/utils/functions";

import styles from "./styles.module.scss";

const { Play, Pause, ThreeDots, Add, Muted, Unmuted } = playerIcons;

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

type MusicList = {
  data: SongsResponse | undefined;
  session: Session;
};

export function MusicList({ data, session }: MusicList) {
  const { mutate } = useSWRConfig();
  const pathname = usePathname();
  const { loadPlayerSource, currentSongRef, playerRef } = usePlayerContext();
  const { isPlaying, setIsPlaying, currentSong, setCurrentSong, handlePause } = usePlayerStore();
  const [isAddingSong, setIsAddingSong] = useState(false);

  const currentAddedSongRef = useRef("");
  const { data: userSongs } = useSongs(session);
  const { searchMutate } = useSearch();

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

  const addSongToMyMusic = async (song: Song) => {
    const { url, id, title, duration } = song;
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

    const addSongDataToDB = await handleFetch<{ message: string }>(`/api/songs/add`, "POST", {
      url,
      id,
      title,
      duration,
      session,
    });

    const saveAndStoreSong = await handleFetch<SaveAndStoreProps>(
      `http://localhost:8000/save-and-store`,
      "POST",
      {
        url,
        id,
      },
    );
    console.log(saveAndStoreSong, " here is save and store");

    mutate(`/api/songs/get-all`);
    setIsAddingSong(false);
    currentAddedSongRef.current = "";

    if (!currentSongRef.current) {
      const getFirstSong = async (): Promise<SongsResponse> => {
        const res = await fetch(`/api/songs/get-all`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session }),
        });

        const data = await res.json();
        return data;
      };

      currentSongRef.current = (await getFirstSong()).songs[0] as Song;
      loadPlayerSource();
    }
  };

  const renderAddButton = (song: Song & { isAdded?: boolean }) => {
    const ifIsSongID = song.id === currentAddedSongRef.current;
    const isSongInDB = userSongs?.songs.find((userSong) => userSong.urlId === song.id);

    if (isAddingSong && ifIsSongID) {
      return <div className={styles.loader} />;
    } else if (isSongInDB) {
      return <Add key={song.id} className={styles.added} />;
    } else {
      return (
        <Add
          key={song.id}
          onClick={async () => {
            await addSongToMyMusic(song);
            searchMutate();
          }}
        />
      );
    }
  };

  const deleteFromMyMusic = async (songId: Song["urlId"]) => {
    const addSongDataToDB = await handleFetch<{ message: string }>(`/api/songs/delete`, "POST", {
      songId,
      session,
    });

    mutate(`/api/songs/get-all`);
  };

  const menuProps = (song: Song) => {
    const list = (className: string) => [
      {
        node: pathname !== "/search" && (
          <li className={className} onClick={() => deleteFromMyMusic(song.id)}>
            x from music
          </li>
        ),
      },
      {
        node: (
          <li className={className}>
            <Link href={song.url} target="_blank">
              source video
            </Link>
          </li>
        ),
      },
    ];

    const result = (
      <>
        {list(styles.musicListMenuProps).map(({ node }) => (
          <React.Fragment key={crypto.randomUUID()}>{node}</React.Fragment>
        ))}
      </>
    );

    return result;
  };

  return (
    <div className={styles.musicListContainer}>
      <ul className={styles.musicList}>
        {data?.songs.map((song) => (
          <div className={styles.liWrapper} key={song.id}>
            <li className={styles.musicListItem}>
              <div className={styles.leftSection}>
                <div className={styles.imageBlock}>
                  {pathname !== "/search" && renderPlayButton(song)}
                  <Image
                    src={
                      pathname === "/search"
                        ? song.cover
                        : `audio/saved/${song.urlId}/thumbnail.jpg`
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
                <MenuDropdown
                  props={menuProps(song)}
                  Icon={<ThreeDots className={styles.threeDotsMenu} />}
                />
              </div>
            </li>

            {pathname === "/search" && <SongPreview song={song} />}
          </div>
        ))}
      </ul>
    </div>
  );
}

function SongPreview({ song }: { song: Song }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    volumeRef,
    volume,
    handleVolumeChange,
    handleMute,
    bufferRef,
    bufferedTime,
    trackSeekRef,
    seek,
    setSeek,
    handleSeekTrack,
  } = usePlayer(audioRef);
  const [isSongPreviewPlaying, setIsSongPreviewPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current?.addEventListener("loadedmetadata", () => {
        console.log("loaded metadata");
      });
    }
  }, []);

  const previewPlay = () => {
    audioRef.current?.play();
    setIsSongPreviewPlaying(true);
  };

  const previewPause = () => {
    audioRef.current?.pause();
    setIsSongPreviewPlaying(false);
  };

  useEffect(() => {
    audioRef.current?.addEventListener("ended", () => {
      if (audioRef.current) {
        updateProgressBar(trackSeekRef, `${(0 / audioRef.current.duration) * 100}`);
        setSeek(0);
        previewPause();
      }
    });
  }, [trackSeekRef, setSeek]);

  return (
    <div className={styles.previewContainer}>
      <div className={styles.trackBlock}>
        <div className={styles.previewHandlers}>
          {isSongPreviewPlaying ? <Pause onClick={previewPause} /> : <Play onClick={previewPlay} />}
        </div>

        <div className={styles.inputs}>
          <input
            className={styles.trackSeek}
            ref={trackSeekRef}
            type="range"
            min={0}
            value={seek}
            onChange={handleSeekTrack}
            max={audioRef.current?.duration || ""}
          />
          <input
            className={styles.buffer}
            ref={bufferRef}
            type="range"
            min={0}
            defaultValue={bufferedTime}
            max={audioRef.current?.duration || ""}
          />
        </div>
      </div>

      <div className={styles.sound}>
        {volume.muted ? (
          <Muted role={"button"} style={{ cursor: "pointer" }} onClick={handleMute} />
        ) : (
          <Unmuted role={"button"} style={{ cursor: "pointer" }} onClick={handleMute} />
        )}
        <input
          className={styles.volume}
          ref={volumeRef}
          type="range"
          value={volume.muted ? 0 : volume.value * 100}
          onChange={handleVolumeChange}
        />
      </div>

      <audio
        controls
        src={`http://localhost:8000/stream?url=${song.url}`}
        preload={"metadata"}
        ref={audioRef}
        style={{ display: "none" }}
      />
    </div>
  );
}
