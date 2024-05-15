"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { RefObject, useCallback, useEffect, useState } from "react";

import { usePlayerContext } from "@/app/_/providers";
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
import { updateProgressBar } from "@/music/_/utils/functions";
import { useChillStore, usePlayerStore } from "@/shared/store";

import { Song } from "../../types";
import styles from "./styles.module.scss";

const { Play, Pause, PreviousTrack, NextTrack, Unmuted: SoundIcon } = playerIcons;

const convertStringDurationToNumber = (duration: string | undefined) => {
  if (!duration) return 0;

  const [hours, minutes, seconds] = duration.split(":");
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
};

export function Player() {
  const { data: session } = useSession();
  const { playerRef, currentSongRef, volumeRef } = usePlayerContext();
  // const { isPlaying, setCurrentSong, handlePlay, handlePause, setIsPlaying, loadPlayerSource } =
  //   usePlayerStore();
  const { error, isLoading, songs } = useSongs(session);

  const isMobile = useMobile(576);
  const duration = convertStringDurationToNumber(currentSongRef.current?.duration);

  // const {
  //   volumeRef,
  //   volume,
  //   handleVolumeChange,
  //   handleMute,
  //   bufferRef,
  //   bufferedTime,
  //   trackSeekRef,
  //   seek,
  //   setSeek,
  //   handleSeekTrack,
  //   setVolume,
  // } = usePlayer(playerRef);
  const {
    currentId,
    setCurrentId,
    isStreaming: isPlaying,
    setIsStreaming,
    handlePause,
    handlePlay,
    volume,
    setVolume,
    handleVolume,
    toggleMute,
  } = useChillStore();
  const [soundMobileOpen, setSoundMobileOpen] = useState(false);

  // useEffect(() => {
  //   if (songs) {
  //     currentSongRef.current = songs[0];
  //     setCurrentSong(songs[0]);

  //     const initialVolume = 0.3;

  //     if (playerRef.current) {
  //       playerRef.current.src = currentSongRef.current?.url
  //         ? `/api/songs/stream?url=${currentSongRef.current?.url}`
  //         : "";
  //       playerRef.current.preload = "auto";
  //       playerRef.current.style.display = "none";
  //       playerRef.current.volume = initialVolume;
  //     }

  //     setVolume({ value: initialVolume, muted: false });
  //     updateProgressBar(volumeRef, `${initialVolume * 100}`);

  //     return () => setIsPlaying(false);
  //   }
  // }, [currentSongRef, songs, setCurrentSong, setIsPlaying, setVolume, volumeRef, playerRef]);

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
      // loadPlayerSource(playerRef, songs[0]);
      // setCurrentSong(songs[0]);
      setCurrentId(songs[0].urlId);
    }

    if (trackIndex < songs.length - 1) {
      currentSongRef.current = songs[trackIndex + 1];
      // loadPlayerSource(playerRef, songs[trackIndex + 1]);
      // setCurrentSong(songs[trackIndex + 1]);
      setCurrentId(songs[trackIndex + 1].urlId);
    }

    handlePlay(playerRef, volume.value * 100);
    // setSeek(0);
    // updateProgressBar(trackSeekRef, `${(0 / duration) * 100}`);
  }, [
    currentSongRef,
    // duration,
    handlePlay,
    playerRef,
    // setCurrentSong,
    // setSeek,
    songs,
    // trackSeekRef,
    // loadPlayerSource,
    setCurrentId,
    volume.value,
  ]);

  // const handlePreviousTrack = () => {
  //   if (!currentSongRef.current) {
  //     return;
  //   }

  //   if (!songs) {
  //     return;
  //   }
  //   const trackIndex = songs.indexOf(currentSongRef.current);

  //   if (trackIndex === 0) {
  //     currentSongRef.current = songs[songs.length - 1];
  //     loadPlayerSource(playerRef, songs[songs.length - 1]);
  //     setCurrentSong(songs[songs.length - 1]);
  //   }

  //   if (trackIndex > 0) {
  //     currentSongRef.current = songs[trackIndex - 1];
  //     loadPlayerSource(playerRef, songs[trackIndex - 1]);
  //     setCurrentSong(songs[trackIndex - 1]);
  //   }

  //   handlePlay(playerRef);
  //   setSeek(0);
  //   updateProgressBar(trackSeekRef, `${(0 / duration) * 100}`);
  // };

  // useEffect(() => {
  //   const player = playerRef.current;
  //   player?.addEventListener("ended", handleNextTrack);

  //   return () => {
  //     player?.removeEventListener("ended", handleNextTrack);
  //   };
  // }, [handleNextTrack, playerRef]);

  // useEffect(() => {
  //   if ((isMobile && soundMobileOpen) || !isMobile) {
  //     updateProgressBar(volumeRef, `${volume.value * 100}`);
  //     updateProgressBar(trackSeekRef, `${(seek / duration) * 100}`);
  //     updateProgressBar(bufferRef, `${(bufferedTime / duration) * 100}`);
  //   }
  // }, [
  //   playerRef,
  //   isMobile,
  //   volumeRef,
  //   volume.value,
  //   seek,
  //   duration,
  //   bufferRef,
  //   bufferedTime,
  //   trackSeekRef,
  //   soundMobileOpen,
  // ]);

  // const inputs = (
  //   <>
  //     <input
  //       className={styles.trackSeek}
  //       ref={trackSeekRef}
  //       type="range"
  //       min={0}
  //       value={seek}
  //       onChange={handleSeekTrack}
  //       max={duration}
  //     />
  //     <input
  //       className={styles.buffer}
  //       ref={bufferRef}
  //       type="range"
  //       min={0}
  //       defaultValue={bufferedTime}
  //       max={duration}
  //     />
  //   </>
  // );

  console.log(currentSongRef.current, playerRef.current);
  if (!session) redirect("/signin");
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    updateProgressBar(volumeRef, `${value}`);

    if (playerRef.current) {
      handleVolume(playerRef, +value);
      setVolume(volumeRef, +value / 100);
    }
  };

  return (
    <>
      {!isMobile ? (
        <PlayerContainer className={styles.desktopPlayerContainer}>
          <ImageBlockDesktop isLoading={isLoading} currentPlayRef={currentSongRef} />

          <MainTrack className={styles.mainTrackDesktop}>
            <div className={styles.buttonsDesktop}>
              {/* <PreviousTrack onClick={handlePreviousTrack} /> */}
              {isPlaying && <Pause onClick={() => handlePause(playerRef)} />}
              {!isPlaying && <Play onClick={() => handlePlay(playerRef, volume.value * 100)} />}

              <NextTrack onClick={handleNextTrack} />
            </div>

            {/* <div className={styles.inputsDesktop}>{inputs}</div> */}

            <TitleDesktop isLoading={isLoading} currentPlayRef={currentSongRef} />
          </MainTrack>

          <SoundDesktop
            volume={volume}
            handleMute={() => toggleMute(playerRef, volumeRef)}
            handleVolumeChange={handleVolumeChange}
            volumeRef={volumeRef}
          />
        </PlayerContainer>
      ) : (
        <PlayerContainer className={styles.mobilePlayerContainer}>
          {/* <div className={styles.inputsMobile}>{inputs}</div> */}

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
                {!isPlaying && <Play onClick={() => handlePlay(playerRef, volume.value * 100)} />}
              </div>

              <div className={styles.title}>{currentSongRef.current?.title || ""}</div>
              <div className={styles.soundMobile}>
                <SoundIcon onClick={() => setSoundMobileOpen(true)} />
              </div>
            </MainTrack>
          )}
        </PlayerContainer>
      )}

      <iframe
        ref={playerRef}
        allow="autoplay; encrypted-media; fullscreen;"
        title="video"
        allowFullScreen
        style={{ display: "none" }}
      />
    </>
  );
}
