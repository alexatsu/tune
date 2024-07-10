"use client";

import Image from "next/image";
import { redirect, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { usePlayerContext } from "@/app/_/providers";
import type { CurrentPayload } from "@/app/_/providers/PlayerProvider";
import { useStreamStore } from "@/app/_/store";
import { miscIcons } from "@/music/_/components/icons/misc";
import { playerIcons } from "@/music/_/components/icons/player";
import {
  ImageBlockDesktop,
  MainTrack,
  PlayerContainer,
  SoundDesktop,
  SoundMobile,
  TitleDesktop,
} from "@/music/_/components/Player|Streamer";
import { useMobile } from "@/music/_/hooks";
import { Song, Stream } from "@/music/_/types";
import { updateProgressBar } from "@/music/_/utils/functions";

import styles from "./styles.module.scss";

const {
  Play,
  Pause,
  PreviousTrack,
  NextTrack,
  Unmuted: SoundIcon,
  RepeatAll,
  RepeatOne,
  Shuffle,
  UnShuffle,
} = playerIcons;
const { LoadingCircle } = miscIcons;

const convertStringDurationToNumber = (duration: string | undefined) => {
  if (!duration) return 0;

  const [hours, minutes, seconds] = duration.split(":");
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
};

export function Player() {
  const { data: session } = useSession();
  const {
    playerRef,
    currentSongOrStreamRef: currentSongRef,
    volumeRef,
    currentPayload,
  } = usePlayerContext();
  const pathname = usePathname();
  const isMobile = useMobile(576);
  const duration = convertStringDurationToNumber(currentSongRef.current?.duration);

  const {
    setCurrentId,
    isStreaming,
    handlePause,
    handlePlay,
    volume,
    setVolume,
    setUnmute,
    handleVolume,
    toggleMute,
    seek,
    setSeek,
    isStartingPlaying,
    setIsStartingPlaying,
  } = useStreamStore();
  const [soundMobileOpen, setSoundMobileOpen] = useState(false);
  const trackSeekRef = useRef<HTMLInputElement>(null);
  const savedVolumeRef = useRef<number>(volume.value);
  const [repeatCurrentTrack, setRepeatCurrentTrack] = useState(false);

  const [shufflePayload, setShufflePayload] = useState(false);
  const tempPayloadRef = useRef(null as CurrentPayload | null);
  console.log(currentSongRef.current, "aga");
  console.log(currentPayload.current, " yo");
  const loadSourceAndPlay = useCallback(
    (songOrStream: Song | Stream) => {
      const { urlId } = songOrStream;

      if (playerRef.current) {
        playerRef.current.src = `https://www.youtube.com/embed/${urlId}?enablejsapi=1&html5=1`;
        currentSongRef.current = songOrStream;

        if (isStreaming) {
          setIsStartingPlaying(true);

          setTimeout(() => {
            playerRef.current?.contentWindow?.postMessage(
              `{"event":"command","func":"setVolume","args":["${volume.value * 100}"]}`,
              "*",
            );
            playerRef.current?.contentWindow?.postMessage(
              '{"event":"command","func":"playVideo","args":""}',
              "*",
            );

            setIsStartingPlaying(false);
          }, 1000);
        }
      }
    },
    [currentSongRef, playerRef, volume, setIsStartingPlaying, isStreaming],
  );

  const handleNextTrack = useCallback(() => {
    const { songsOrStreams } = currentPayload.current || {};
    if (!currentSongRef.current) {
      return;
    }

    const trackIndex = songsOrStreams?.indexOf(currentSongRef.current);
    if (trackIndex === -1 || trackIndex === undefined) {
      return;
    }

    if (songsOrStreams) {
      if (trackIndex === songsOrStreams.length - 1) {
        currentSongRef.current = songsOrStreams[0];

        loadSourceAndPlay(songsOrStreams[0]);
        setCurrentId(songsOrStreams[0].urlId);
      }

      if (trackIndex < songsOrStreams.length - 1) {
        currentSongRef.current = songsOrStreams[trackIndex + 1];

        loadSourceAndPlay(songsOrStreams[trackIndex + 1]);
        setCurrentId(songsOrStreams[trackIndex + 1].urlId);
      }

      setSeek(0);
      updateProgressBar(trackSeekRef, `${(0 / duration) * 100}`);
    }
  }, [currentSongRef, setCurrentId, loadSourceAndPlay, duration, currentPayload, setSeek]);

  const handlePreviousTrack = () => {
    const { songsOrStreams } = currentPayload.current || {};
    if (!currentSongRef.current) {
      return;
    }

    const trackIndex = songsOrStreams?.indexOf(currentSongRef.current);

    if (trackIndex === -1 || trackIndex === undefined) {
      return;
    }

    if (songsOrStreams) {
      if (trackIndex === 0) {
        currentSongRef.current = songsOrStreams[songsOrStreams.length - 1];

        setCurrentId(songsOrStreams[songsOrStreams.length - 1].urlId);
        loadSourceAndPlay(songsOrStreams[songsOrStreams.length - 1]);
      }

      if (trackIndex > 0) {
        currentSongRef.current = songsOrStreams[trackIndex - 1];

        setCurrentId(songsOrStreams[trackIndex - 1].urlId);
        loadSourceAndPlay(songsOrStreams[trackIndex - 1]);
      }

      setSeek(0);
      updateProgressBar(trackSeekRef, `${(0 / duration) * 100}`);
    }
  };

  const handleRepeatSingleSong = () => {
    setRepeatCurrentTrack(!repeatCurrentTrack);
  };

  const handleRepeatCurrentSong = useCallback(() => {
    if (!currentSongRef.current) {
      return;
    }
    loadSourceAndPlay(currentSongRef.current);
    setSeek(0);
    updateProgressBar(trackSeekRef, `${(0 / duration) * 100}`);
  }, [duration, trackSeekRef, currentSongRef, setSeek, loadSourceAndPlay]);

  const handleShufflePayload = () => {
    if (!shufflePayload) {
      setShufflePayload(true);
      tempPayloadRef.current = currentPayload.current;

      const copyPayload = Array.from(currentPayload.current?.songsOrStreams || []);

      copyPayload.sort(() => Math.random() - 0.5);

      currentPayload.current = {
        songsOrStreams: copyPayload,
        type: currentPayload.current?.type,
        id: currentPayload.current?.id,
      };
    } else {
      setShufflePayload(false);
      currentPayload.current = tempPayloadRef.current;
      tempPayloadRef.current = null;
    }
  };

  useEffect(() => {
    if (currentPayload.current?.type === "streams") return;
    if (seek >= duration) {
      repeatCurrentTrack ? handleRepeatCurrentSong() : handleNextTrack();
    }
  }, [
    duration,
    handleNextTrack,
    seek,
    currentPayload,
    repeatCurrentTrack,
    handleRepeatCurrentSong,
  ]);

  useEffect(() => {
    if ((isMobile && soundMobileOpen) || !isMobile) {
      updateProgressBar(volumeRef, `${volume.value * 100}`);
      updateProgressBar(trackSeekRef, `${(seek / duration) * 100}`);
    }
  }, [playerRef, isMobile, volumeRef, volume.value, seek, duration, trackSeekRef, soundMobileOpen]);

  const handleSeekTrack = (event: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = Number(event.target.value);
    const player = playerRef.current;

    if (seekTime >= duration) {
      event.preventDefault();
      return;
    }

    setSeek(seekTime);
    player?.contentWindow?.postMessage(
      `{"event":"command","func":"seekTo","args":[${seekTime}]}`,
      "*",
    );
    updateProgressBar(trackSeekRef, `${(seekTime / duration) * 100}`);
  };

  useEffect(() => {
    if (currentPayload.current?.type === "streams") return;
    const updateCurrentTime = setInterval(() => {
      const player = playerRef.current;

      if (!isStreaming) return;

      if (player) {
        setSeek(seek + 1);
        updateProgressBar(trackSeekRef, `${(seek / duration) * 100}`);
      }
    }, 1000);

    return () => clearInterval(updateCurrentTime);
  }, [playerRef, isStreaming, duration, seek, currentPayload, setSeek]);

  if (!session) redirect("/signin");

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (playerRef.current) {
      handleVolume(playerRef, +value);
      setVolume(volumeRef, +value / 100);
    }

    if (volume.muted) {
      setUnmute(playerRef);
    }
    updateProgressBar(volumeRef, `${value}`);
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
      {/* <input
        className={styles.buffer}
        ref={bufferRef}
        type="range"
        min={0}
        defaultValue={bufferedTime}
        max={duration}
      /> */}
    </>
  );

  const playOrPause = () => {
    return isStreaming ? (
      <Pause onClick={() => handlePause(playerRef)} />
    ) : (
      <Play onClick={() => handlePlay(playerRef, volume.value * 100)} />
    );
  };

  return (
    <>
      {!isMobile ? (
        <PlayerContainer className={styles.desktopPlayerContainer}>
          <ImageBlockDesktop currentPlayRef={currentSongRef} />
          <MainTrack className={styles.mainTrackDesktop}>
            <div className={styles.buttonsDesktop}>
              <div onClick={handleShufflePayload} className={styles.shuffle}>
                {shufflePayload ? <UnShuffle /> : <Shuffle />}
              </div>
              <PreviousTrack onClick={handlePreviousTrack} style={{ cursor: "pointer" }} />
              {isStartingPlaying ? (
                <div className={styles.playOrPauseLoader}>
                  <LoadingCircle />
                </div>
              ) : (
                <div className={styles.playOrPause}>{playOrPause()}</div>
              )}
              <NextTrack onClick={handleNextTrack} />
              <div onClick={handleRepeatSingleSong}>
                {repeatCurrentTrack ? <RepeatOne /> : <RepeatAll />}
              </div>
            </div>

            {currentPayload.current?.type !== "streams" ? (
              <div className={styles.inputsDesktop}>{inputs}</div>
            ) : (
              <div className="filler" style={{ visibility: "hidden", height: "2rem" }}></div>
            )}

            <TitleDesktop currentPlayRef={currentSongRef} />
          </MainTrack>

          <SoundDesktop
            volume={volume}
            handleMute={() => toggleMute(playerRef, volumeRef, savedVolumeRef)}
            handleVolumeChange={handleVolumeChange}
            volumeRef={volumeRef}
          />
        </PlayerContainer>
      ) : (
        <PlayerContainer className={styles.mobilePlayerContainer}>
          {currentPayload.current?.type !== "streams" && (
            <div className={styles.inputsMobile}>{inputs}</div>
          )}

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

                {isStartingPlaying ? (
                  <div className={styles.playOrPauseLoaderMobile}>
                    <LoadingCircle />
                  </div>
                ) : (
                  playOrPause()
                )}
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
