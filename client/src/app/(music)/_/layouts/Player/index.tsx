"use client";

import Hls from "hls.js";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

import { playerIcons } from "@/music/_/components/icons/player";
import { useMobile, usePlayer, useSongs } from "@/music/_/hooks";
import { usePlayerContext } from "@/music/_/providers";
import { updateProgressBar } from "@/music/_/utils/functions";
import { usePlayerStore } from "@/shared/store";

import styles from "./styles.module.scss";

// TODO:
// - loading states
// - error handling

const hls = new Hls();
const { Unmuted, Muted, Play, Pause, PreviousTrack, NextTrack, ThreeDots } = playerIcons;

const convertStringDurationToNumber = (duration: string | undefined) => {
  if (!duration) return 0;

  const [hours, minutes, seconds] = duration.split(":");
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
};

export function Player() {
  const { data: session } = useSession();
  const { playerRef, currentSongRef, loadPlayerSource } = usePlayerContext();
  const { isPlaying, handlePause, handlePlay, setCurrentSong, setIsPlaying } = usePlayerStore();
  const { error, isLoading, songs } = useSongs(session);

  const isMobile = useMobile(576);
  const duration = convertStringDurationToNumber(currentSongRef.current?.duration);

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
  } = usePlayer(playerRef);

  useEffect(() => {
    if (songs) {
      currentSongRef.current = songs[0];
      console.log(currentSongRef.current, "current track");
      setCurrentSong(songs[0]);

      if (playerRef && currentSongRef.current) {
        loadPlayerSource();
      }

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log("video and hls.js are now bound together !");
      });

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log("manifest loaded, found " + data.levels.length + " quality level");
      });

      return () => {
        hls.destroy();
        setIsPlaying(false);
      };
    }
  }, [currentSongRef, playerRef, songs, setCurrentSong, loadPlayerSource, setIsPlaying]);

  const handleNextTrack = useCallback(() => {
    if (currentSongRef.current === null) {
      console.log("no current next track");
      return;
    }

    if (!songs) {
      console.log("no source to handle next track");
      return;
    }

    const trackIndex = songs.indexOf(currentSongRef.current);

    if (trackIndex === songs.length - 1) {
      currentSongRef.current = songs[0];
      setCurrentSong(songs[0]);
    }

    if (trackIndex < songs.length - 1) {
      currentSongRef.current = songs[trackIndex + 1];
      setCurrentSong(songs[trackIndex + 1]);
    }

    setSeek(0);
    updateProgressBar(trackSeekRef, `${(0 / duration) * 100}`);
    loadPlayerSource();
    handlePlay(playerRef);
  }, [
    currentSongRef,
    duration,
    handlePlay,
    loadPlayerSource,
    playerRef,
    setCurrentSong,
    setSeek,
    songs,
    trackSeekRef,
  ]);

  const handlePreviousTrack = () => {
    if (currentSongRef.current === null) {
      console.log("no current previous track");
      return;
    }

    if (!songs) {
      console.log("no source to handle previous track");
      return;
    }
    const trackIndex = songs.indexOf(currentSongRef.current);

    if (trackIndex === 0) {
      currentSongRef.current = songs[songs.length - 1];
      setCurrentSong(songs[songs.length - 1]);
    }

    if (trackIndex > 0) {
      currentSongRef.current = songs[trackIndex - 1];
      setCurrentSong(songs[trackIndex - 1]);
    }

    setSeek(0);
    updateProgressBar(trackSeekRef, `${(0 / duration) * 100}`);
    loadPlayerSource();
    handlePlay(playerRef);
  };

  useEffect(() => {
    const player = playerRef.current;
    player?.addEventListener("ended", handleNextTrack);

    return () => {
      player?.removeEventListener("ended", handleNextTrack);
    };
  }, [handleNextTrack, playerRef]);

  useEffect(() => {
    const initialVolume = 0.3;

    if (playerRef.current && volumeRef.current) {
      playerRef.current.volume = initialVolume;

      volumeRef.current.value = `${initialVolume * 100}`;
      updateProgressBar(volumeRef, `${playerRef.current?.volume * 100}`);
    }
  }, [playerRef, volumeRef]);

  ///
  useEffect(() => {
    if (playerRef.current && volumeRef.current && !isMobile) {
      updateProgressBar(volumeRef, `${playerRef.current?.volume * 100}`);
    }
  }, [playerRef, isMobile, volumeRef]);

  const inputs = (
    <>
      <input
        className={styles.trackSeek}
        ref={trackSeekRef}
        type="range"
        min={0}
        value={seek}
        onChange={handleSeekTrack}
        max={duration}
      />
      <input
        className={styles.buffer}
        ref={bufferRef}
        type="range"
        min={0}
        defaultValue={bufferedTime}
        max={duration}
      />
    </>
  );

  if (!session) redirect("/signin");

  return (
    <>
      {!isMobile ? (
        <div className={styles.playerContainer}>
          <div className={styles.imageBlock}>
            {currentSongRef.current && (
              <Image
                src={`${process.env.MUSIC_SERVICE_CONTAINER}/audio/saved/${currentSongRef.current?.urlId}/thumbnail.jpg`}
                alt="cover"
                width={50}
                height={50}
                unoptimized
              />
            )}
          </div>

          <div className={styles.mainTrack}>
            <div className={styles.buttons}>
              <PreviousTrack onClick={handlePreviousTrack} />
              {isPlaying ? (
                <Pause onClick={() => handlePause(playerRef)} />
              ) : (
                <Play onClick={() => handlePlay(playerRef)} />
              )}
              <NextTrack onClick={handleNextTrack} />
            </div>

            <div className={styles.inputs}>{inputs}</div>
            <div className={styles.title}>{currentSongRef.current?.title || ""}</div>
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
        </div>
      ) : (
        <div className={styles.mobilePlayerContainer}>
          <div className={styles.inputs}>{inputs}</div>

          <div className={styles.main}>
            <div className={styles.imageBlock}>
              {currentSongRef.current && (
                <Image
                  src={`${process.env.MUSIC_SERVICE_CONTAINER}/audio/saved/${currentSongRef?.current?.urlId}/thumbnail.jpg`}
                  alt="cover"
                  width={35}
                  height={35}
                  unoptimized
                />
              )}
              {isPlaying ? (
                <Pause onClick={() => handlePause(playerRef)} />
              ) : (
                <Play onClick={() => handlePlay(playerRef)} />
              )}
            </div>

            <div className={styles.title}>{currentSongRef.current?.title || ""}</div>
            <div className={styles.menuContainer}>
              <ThreeDots className={styles.threeDotsMenu} />
            </div>
          </div>
        </div>
      )}

      <video
        style={{ display: "none" }}
        ref={playerRef}
        controls
        width={320}
        height={240}
        id="video"
      ></video>
    </>
  );
}
