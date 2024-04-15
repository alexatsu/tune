"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { RefObject, useCallback, useEffect, useState } from "react";

import { playerIcons } from "@/music/_/components/icons/player";
import {
  ImageBlockDesktop,
  MainTrack,
  PlayerContainer,
  SoundDesktop,
  SoundMobile,
  TitleDesktop,
} from "@/music/_/components/Player|Streamer";
import { useMobile, usePlayer, useSongs } from "@/music/_/hooks";
import { usePlayerContext } from "@/music/_/providers";
import { updateProgressBar } from "@/music/_/utils/functions";
import { usePlayerStore } from "@/shared/store";

import styles from "./styles.module.scss";

const { Play, Pause, PreviousTrack, NextTrack, Unmuted: SoundIcon } = playerIcons;

const convertStringDurationToNumber = (duration: string | undefined) => {
  if (!duration) return 0;

  const [hours, minutes, seconds] = duration.split(":");
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
};

export function Player() {
  const { data: session } = useSession();
  const { playerRef, currentSongRef } = usePlayerContext();
  const { isPlaying, setCurrentSong, handlePlay, handlePause, setIsPlaying, loadPlayerSource } =
    usePlayerStore();
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
    setVolume,
  } = usePlayer(playerRef);

  const [soundMobileOpen, setSoundMobileOpen] = useState(false);

  useEffect(() => {
    if (songs) {
      currentSongRef.current = songs[0];
      setCurrentSong(songs[0]);

      const initialVolume = 0.3;

      if (playerRef.current) {
        playerRef.current.volume = initialVolume;
      }

      setVolume({ value: initialVolume, muted: false });
      updateProgressBar(volumeRef, `${initialVolume * 100}`);

      return () => setIsPlaying(false);
    }
  }, [currentSongRef, songs, setCurrentSong, setIsPlaying, setVolume, volumeRef, playerRef]);

  const handleNextTrack = useCallback(() => {
    if (!currentSongRef.current) {
      return;
    }

    if (!songs) {
      return;
    }
    const trackIndex = songs.indexOf(currentSongRef.current);

    if (trackIndex === songs.length - 1) {
      currentSongRef.current = songs[0];
      loadPlayerSource(playerRef, songs[0]);
      setCurrentSong(songs[0]);
    }

    if (trackIndex < songs.length - 1) {
      currentSongRef.current = songs[trackIndex + 1];
      loadPlayerSource(playerRef, songs[trackIndex + 1]);
      setCurrentSong(songs[trackIndex + 1]);
    }

    handlePlay(playerRef);
    setSeek(0);
    updateProgressBar(trackSeekRef, `${(0 / duration) * 100}`);
  }, [
    currentSongRef,
    duration,
    handlePlay,
    playerRef,
    setCurrentSong,
    setSeek,
    songs,
    trackSeekRef,
    loadPlayerSource,
  ]);

  const handlePreviousTrack = () => {
    if (!currentSongRef.current) {
      return;
    }

    if (!songs) {
      return;
    }
    const trackIndex = songs.indexOf(currentSongRef.current);

    if (trackIndex === 0) {
      currentSongRef.current = songs[songs.length - 1];
      loadPlayerSource(playerRef, songs[songs.length - 1]);
      setCurrentSong(songs[songs.length - 1]);
    }

    if (trackIndex > 0) {
      currentSongRef.current = songs[trackIndex - 1];
      loadPlayerSource(playerRef, songs[trackIndex - 1]);
      setCurrentSong(songs[trackIndex - 1]);
    }

    handlePlay(playerRef);
    setSeek(0);
    updateProgressBar(trackSeekRef, `${(0 / duration) * 100}`);
  };

  useEffect(() => {
    const player = playerRef.current;
    player?.addEventListener("ended", handleNextTrack);

    return () => {
      player?.removeEventListener("ended", handleNextTrack);
    };
  }, [handleNextTrack, playerRef]);

  useEffect(() => {
    if ((isMobile && soundMobileOpen) || !isMobile) {
      updateProgressBar(volumeRef, `${volume.value * 100}`);
      updateProgressBar(trackSeekRef, `${(seek / duration) * 100}`);
      updateProgressBar(bufferRef, `${(bufferedTime / duration) * 100}`);
    }
  }, [
    playerRef,
    isMobile,
    volumeRef,
    volume.value,
    seek,
    duration,
    bufferRef,
    bufferedTime,
    trackSeekRef,
    soundMobileOpen,
  ]);

  const handleRetry = (playerRef: RefObject<HTMLVideoElement>) => {
    const RETRY_LIMIT = 3;
    const initialRetryDelay = 1000;
    let retryCount = 0;
    let retryDelay = initialRetryDelay;

    const retryConnection = () => {
      if (retryCount < RETRY_LIMIT) {
        setTimeout(() => {
          if (currentSongRef.current) {
            loadPlayerSource(playerRef, currentSongRef.current);
            handlePlay(playerRef);

            console.log("Connection re-established. Connection in " + retryDelay + "ms...");
            retryCount++;
            retryDelay *= 2;
          } else {
            console.log("currentSongRef.current is undefined");
          }
        }, retryDelay);
      } else {
        console.error("Maximum retry limit reached. Unable to play the song.");
      }
    };

    retryConnection();
  };

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
        <PlayerContainer className={styles.desktopPlayerContainer}>
          <ImageBlockDesktop isLoading={isLoading} currentSongRef={currentSongRef} />

          <MainTrack className={styles.mainTrackDesktop}>
            <div className={styles.buttonsDesktop}>
              <PreviousTrack onClick={handlePreviousTrack} />
              {isPlaying && <Pause onClick={() => handlePause(playerRef)} />}
              {!isPlaying && <Play onClick={() => handlePlay(playerRef)} />}

              <NextTrack onClick={handleNextTrack} />
            </div>

            <div className={styles.inputsDesktop}>{inputs}</div>

            <TitleDesktop isLoading={isLoading} currentSongRef={currentSongRef} />
          </MainTrack>

          <SoundDesktop
            volume={volume}
            handleMute={handleMute}
            handleVolumeChange={handleVolumeChange}
            volumeRef={volumeRef}
          />
        </PlayerContainer>
      ) : (
        <PlayerContainer className={styles.mobilePlayerContainer}>
          <div className={styles.inputsMobile}>{inputs}</div>

          {soundMobileOpen ? (
            <SoundMobile
              volume={volume}
              handleVolumeChange={handleVolumeChange}
              volumeRef={volumeRef}
              setSoundMobileOpen={setSoundMobileOpen}
            />
          ) : (
            <MainTrack className={styles.mainTrackMobile}>
              <div className={styles.imageBlockMobile}>
                {currentSongRef.current && (
                  <Image
                    src={currentSongRef.current?.cover || ""}
                    alt="cover"
                    width={35}
                    height={35}
                    unoptimized
                  />
                )}

                {isPlaying && <Pause onClick={() => handlePause(playerRef)} />}
                {!isPlaying && <Play onClick={() => handlePlay(playerRef)} />}
              </div>

              <div className={styles.title}>{currentSongRef.current?.title || ""}</div>
              <div className={styles.soundMobile}>
                <SoundIcon onClick={() => setSoundMobileOpen(true)} />
              </div>
            </MainTrack>
          )}
        </PlayerContainer>
      )}

      <audio
        controls
        src={
          currentSongRef.current?.url ? `/api/songs/stream?url=${currentSongRef.current?.url}` : ""
        }
        preload={"auto"}
        ref={playerRef}
        style={{ display: "none" }}
        onError={(e) => {
          console.log("audio error is triggered", e);
          handleRetry(playerRef);
        }}
      />
    </>
  );
}
