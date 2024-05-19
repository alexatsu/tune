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
import { useStreamStore } from "@/shared/store";
import { customRevalidatePath, handleFetch } from "@/shared/utils/functions";

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
  data: {
    songs: Song[] | AlbumSongs[];
    message: string;

    type: string | undefined;
    id?: string | undefined;
  };
  session: Session;
};

export function MusicList({ data, session }: MusicList) {
  const { mutate } = useSWRConfig();
  const pathname = usePathname();
  const { currentSongOrStreamRef, playerRef, currentPayload } = usePlayerContext();
  const { data: userSongs } = useSongs(session);

  const [isAddingSong, setIsAddingSong] = useState(false);
  const currentAddedSongRef = useRef("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [isSongInTheAlbumAccordionOpen, setIsSongInTheAlbumAccordionOpen] = useState(false);

  const { albums, albumsMutate, albumsIsLoading } = useAlbums();
  const [currentScrollableAlbumId, setCurrentScrollableAlbumId] = useState<string | null>(null);
  const addToAlbumContainerRef = useRef<HTMLDivElement>(null);
  const {
    currentId,
    setCurrentId,
    isStreaming: isPlaying,
    setIsStreaming,
    handlePause,
    volume,
    setSeek,
  } = useStreamStore();

  const handlePlayById = (song: Song, volume: number) => {
    const { urlId } = song;
    setIsStreaming(true);
    setCurrentId(urlId);
    setSeek(0);

    if (!currentPayload.current || currentPayload.current.type !== data.type) {
      currentPayload.current = {
        songsOrStreams: data.songs,
        type: data.type,
      };
    }

    if (currentId === urlId) {
      playerRef.current?.contentWindow?.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        "*",
      );
      return;
    }

    if (playerRef.current) {
      playerRef.current.src = `https://www.youtube.com/embed/${urlId}?enablejsapi=1&html5=1`;
      currentSongOrStreamRef.current = song;

      setTimeout(() => {
        playerRef.current?.contentWindow?.postMessage(
          `{"event":"command","func":"setVolume","args":["${volume}"]}`,
          "*",
        );
        playerRef.current?.contentWindow?.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          "*",
        );
      }, 1000);
    }
  };

  const renderPlayButton = (song: Song) => {
    const iscurrentTrackRef = song.urlId === currentId;

    const playButton = (
      <div className={styles.notPlaying} onClick={() => handlePlayById(song, volume.value * 100)}>
        <Play />
      </div>
    );
    const pauseButton = (
      <div className={styles.playing} onClick={() => handlePause(playerRef)}>
        <Pause />
      </div>
    );

    if (isPlaying && iscurrentTrackRef && currentPayload.current?.type === data.type) {
      return pauseButton;
    } else {
      return playButton;
    }
  };

  const addSongToMyMusic = async (song: Song) => {
    const { url, id, title, duration, cover } = song;
    setIsAddingSong(true);
    currentAddedSongRef.current = id;

    const addSongDataToDB = await handleFetch<{ message: string }>(`/api/songs/add`, "POST", {
      url,
      id,
      title,
      duration,
      cover,
      session,
    });

    currentAddedSongRef.current = "";

    setIsAddingSong(false);
    mutate(`/api/songs/get-all`);
  };

  const renderAddButton = (song: Song & { isAdded?: boolean }) => {
    const ifIsSongID = song.id === currentAddedSongRef.current;
    const isSongInDB = userSongs?.songs.find((userSong) => userSong.urlId === song.urlId);

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
    setOpenDropdownIndex(null);
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
    customRevalidatePath(`/albums/${album.id}`);
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
                  {renderPlayButton(song)}
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
          </div>
        ))}
      </ul>
    </div>
  );
}
