"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSWRConfig } from "swr";

import { MenuDropdown } from "@/app/_/components/MenuDropdown";
import { usePlayerContext } from "@/app/_/providers";
import { playerIcons } from "@/music/_/components/icons/player";
import { useAlbums, usePlayer, useSongs } from "@/music/_/hooks";
import { Album, AlbumSongs, Song, SongsResponse } from "@/music/_/types";
import { updateProgressBar } from "@/music/_/utils/functions";
import { usePlayerStore } from "@/shared/store";
import { customRevalidateTag, handleFetch } from "@/shared/utils/functions";

import { miscIcons } from "../icons/misc";
import styles from "./styles.module.scss";

const { Play, Pause, ThreeDots, Add, Muted, Unmuted } = playerIcons;
const { LoadingCircle } = miscIcons;

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
  data: { songs: Song[] | AlbumSongs[]; message: string };
  session: Session;
};

export function MusicList({ data, session }: MusicList) {
  const { mutate } = useSWRConfig();
  const pathname = usePathname();
  const { currentSongRef, playerRef } = usePlayerContext();
  const {
    isPlaying,
    setIsPlaying,
    handlePlay,
    currentSong,
    setCurrentSong,
    handlePause,
    loadPlayerSource,
  } = usePlayerStore();

  const { data: userSongs } = useSongs(session);
  const [isAddingSong, setIsAddingSong] = useState(false);
  const currentAddedSongRef = useRef("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [isSongInTheAlbumAccordionOpen, setIsSongInTheAlbumAccordionOpen] = useState(false);
  const { albums, albumsMutate, albumsError, albumsIsLoading } = useAlbums();
  const [currentScrollableAlbumId, setCurrentScrollableAlbumId] = useState<string | null>(null);
  const addToAlbumContainerRef = useRef<HTMLDivElement>(null);

  const handlePlayById = async (song: Song) => {
    if (currentSongRef.current?.urlId === song.urlId) {
      handlePlay(playerRef);
      setIsPlaying(true);
      return;
    }

    currentSongRef.current = song;
    setCurrentSong(song);
    loadPlayerSource(playerRef, currentSongRef.current);
    handlePlay(playerRef);
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
    const { url, id, title, duration, cover } = song;
    setIsAddingSong(true);
    currentAddedSongRef.current = id;

    const addSongDataToDB = await handleFetch<{ message: string }>(`/api/songs/create`, "POST", {
      url,
      id,
      title,
      duration,
      cover,
      session,
    });

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

      const firstSong = (await getFirstSong()).songs[0] as Song;
      currentSongRef.current = firstSong;
      setCurrentSong(firstSong);
      loadPlayerSource(playerRef, currentSongRef.current);
      mutate(`/api/songs/get-all`);
    }
    setIsAddingSong(false);
    mutate(`/api/songs/get-all`);
  };

  const renderAddButton = (song: Song & { isAdded?: boolean }) => {
    const ifIsSongID = song.id === currentAddedSongRef.current;
    const isSongInDB = userSongs?.songs.find((userSong) => userSong.urlId === song.id);

    if (isAddingSong && ifIsSongID) {
      return <LoadingCircle />;
    } else if (isSongInDB) {
      return <Add key={song.id} className={styles.added} />;
    } else {
      return (
        <Add
          key={song.id}
          onClick={async () => {
            await addSongToMyMusic(song);
          }}
        />
      );
    }
  };

  const deleteFromMyMusic = async (songId: Song["urlId"]) => {
    await handleFetch<{ message: string }>(`/api/songs/delete`, "POST", {
      songId,
      session,
    });

    mutate(`/api/songs/get-all`);
  };

  const handleMusicListDropdownToggle = useCallback(
    (index: number) => {
      setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    },
    [openDropdownIndex],
  );

  useEffect(() => {
    const handleClickOutsideDropdown = (event: MouseEvent) => {
      if (
        (event.target as HTMLElement).tagName === "LI" ||
        (event.target as HTMLElement).tagName === "SPAN"
      ) {
        return;
      } else {
        setOpenDropdownIndex(null);
        setIsSongInTheAlbumAccordionOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutsideDropdown);
    return () => {
      document.removeEventListener("click", handleClickOutsideDropdown);
    };
  }, [
    isSongInTheAlbumAccordionOpen,
    setIsSongInTheAlbumAccordionOpen,
    openDropdownIndex,
    handleMusicListDropdownToggle,
  ]);

  const handleSongInAlbumAccordion = (event: React.MouseEvent<HTMLLIElement>) => {
    event.stopPropagation();
    setIsSongInTheAlbumAccordionOpen(!isSongInTheAlbumAccordionOpen);
  };

  const checkIfSongInTheAlbum = (song: Song, album: Album) => {
    const findSongInAlbum = album.albumSongs.find((albumSong) => albumSong.urlId === song.urlId);
    if (findSongInAlbum) {
      return <p>&#10004;</p>;
    } else {
      return <p>+</p>;
    }
  };

  const addOrRemoveSongInTheAlbum = async (song: Song, album: Album) => {
    await handleFetch<{ message: string }>(`/api/albums/add-or-delete-song`, "POST", {
      session,
      album,
      song,
    });
    albumsMutate();
    customRevalidateTag(`/albums/${album.id}`);
    setCurrentScrollableAlbumId(album.id);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentScrollableAlbumId) {
        const albumElement = document.querySelector(
          `li[data-album-id="${currentScrollableAlbumId}"]`,
        );
        albumElement?.scrollIntoView({ block: "center" });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentScrollableAlbumId]);

  const dropdownMenuProps = (song: Song, pathname: string) => {
    const classAddToAlbumContainer = isSongInTheAlbumAccordionOpen
      ? styles.addToAlbumsContainerVisible
      : styles.addToAlbumsContainer;

    const checkIfAlbumId = pathname.split("/");
    const getAlbumById = (id: string) => albums?.albums.find((album) => album.id === id);

    const list = (className: string) => [
      {
        node: pathname === "/allmusic" && (
          <>
            <li className={className} onClick={(e) => handleSongInAlbumAccordion(e)}>
              add to album
            </li>
            {isSongInTheAlbumAccordionOpen && (
              <div className={classAddToAlbumContainer} ref={addToAlbumContainerRef}>
                {albums?.albums.map((album) => (
                  <li
                    data-album-id={album.id}
                    className={styles.addToAlbums}
                    key={album.id}
                    onClick={() => addOrRemoveSongInTheAlbum(song, album)}
                  >
                    {albumsIsLoading ? <LoadingCircle /> : checkIfSongInTheAlbum(song, album)}
                    <span className={styles.addToAlbumsTitle}>{album.title}</span>
                  </li>
                ))}
              </div>
            )}
          </>
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
      {
        node: pathname === "/allmusic" && (
          <li className={styles.deleteSong} onClick={() => deleteFromMyMusic(song.id)}>
            x from music
          </li>
        ),
      },
      ...(checkIfAlbumId.length > 2
        ? [
            {
              node: (
                <li
                  className={styles.deleteSong}
                  onClick={() => addOrRemoveSongInTheAlbum(song, getAlbumById(checkIfAlbumId[2])!)}
                >
                  x from album
                </li>
              ),
            },
          ]
        : []),
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
        {data?.songs?.map((song, index) => (
          <div className={styles.liWrapper} key={song.id}>
            <li className={styles.musicListItem}>
              <div className={styles.leftSection}>
                <div className={styles.imageBlock}>
                  {pathname !== "/search" && renderPlayButton(song)}
                  <Image
                    src={song.cover || ""}
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
                  props={dropdownMenuProps(song, pathname)}
                  Icon={<ThreeDots className={styles.threeDotsMenu} />}
                  isOpen={openDropdownIndex === index}
                  setIsOpen={() => handleMusicListDropdownToggle(index)}
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
        src={`/api/songs/stream?url=${song.url}`}
        preload={"metadata"}
        ref={audioRef}
        style={{ display: "none" }}
      />
    </div>
  );
}
