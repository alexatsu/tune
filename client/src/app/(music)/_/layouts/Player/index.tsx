"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

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

export function Player() {
  const { data: session } = useSession();
  const {
    playerRef,
    playerUrl,
    currentSongOrStreamRef: currentSongRef,
    volumeRef,
    currentPayload,
  } = usePlayerContext();
  const isMobile = useMobile(576);

  const {
    setCurrentId,
    isStreaming,
    handlePause,
    handlePlay,
    volume,
    setVolume,
    setUnmute,
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

  const loadSource = useCallback(
    (songOrStream: Song | Stream) => {
      const { url } = songOrStream;

      if (playerRef.current) {
        playerUrl.current = url;
        currentSongRef.current = songOrStream;

        setIsStartingPlaying(true);
      }
    },
    [currentSongRef, playerRef, playerUrl, setIsStartingPlaying],
  );

  const handleNextTrack = useCallback(() => {
    const { songsOrStreams } = currentPayload.current || {};
    if (!currentSongRef.current) {
      return;
    }

    const trackIndex = songsOrStreams?.indexOf(currentSongRef.current);
    if (trackIndex === -1 || trackIndex === undefined) {
      console.log(currentSongRef.current, currentPayload.current);
      console.log("error");
      return;
    }

    if (songsOrStreams) {
      if (trackIndex === songsOrStreams.length - 1) {
        currentSongRef.current = songsOrStreams[0];

        loadSource(songsOrStreams[0]);
        setCurrentId(songsOrStreams[0].urlId);
      }

      if (trackIndex < songsOrStreams.length - 1) {
        currentSongRef.current = songsOrStreams[trackIndex + 1];

        loadSource(songsOrStreams[trackIndex + 1]);
        setCurrentId(songsOrStreams[trackIndex + 1].urlId);
      }

      setSeek(0);
      const player = playerRef.current;
      if (player) {
        updateProgressBar(trackSeekRef, `${(0 / player.getDuration()) * 100}`);
      }
    }
  }, [currentSongRef, setCurrentId, loadSource, currentPayload, setSeek, playerRef]);

  const handlePreviousTrack = () => {
    const { songsOrStreams } = currentPayload.current || {};
    if (!currentSongRef.current) {
      return;
    }

    const trackIndex = songsOrStreams?.indexOf(currentSongRef.current);

    if (trackIndex === -1 || trackIndex === undefined) {
      console.log("error");
      return;
    }

    if (songsOrStreams) {
      if (trackIndex === 0) {
        currentSongRef.current = songsOrStreams[songsOrStreams.length - 1];

        setCurrentId(songsOrStreams[songsOrStreams.length - 1].urlId);
        loadSource(songsOrStreams[songsOrStreams.length - 1]);
      }

      if (trackIndex > 0) {
        currentSongRef.current = songsOrStreams[trackIndex - 1];

        setCurrentId(songsOrStreams[trackIndex - 1].urlId);
        loadSource(songsOrStreams[trackIndex - 1]);
      }

      setSeek(0);
      const player = playerRef.current;
      if (player) {
        updateProgressBar(trackSeekRef, `${(0 / player.getDuration()) * 100}`);
      }
    }
  };

  const handleRepeatSingleSong = () => setRepeatCurrentTrack(!repeatCurrentTrack);

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
    if ((isMobile && soundMobileOpen) || !isMobile) {
      updateProgressBar(volumeRef, `${volume.value * 100}`);
      const player = playerRef.current;
      if (player) {
        updateProgressBar(trackSeekRef, `${(seek / player.getDuration()) * 100}`);
      }
    }
  }, [playerRef, isMobile, volumeRef, volume.value, seek, trackSeekRef, soundMobileOpen]);

  const handleSeekTrack = (event: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = Number(event.target.value);
    const player = playerRef.current;
    const duration = player?.getDuration();

    if (!player) return;

    if (duration && seekTime >= duration) {
      event.preventDefault();
      return;
    }

    player?.seekTo(seekTime);
    setSeek(seekTime);

    if (duration) {
      updateProgressBar(trackSeekRef, `${(seekTime / duration) * 100}`);
    }
  };

  useEffect(() => {
    if (currentPayload.current?.type === "streams") return;
    const updateCurrentTime = setInterval(() => {
      const player = playerRef.current;

      if (!isStreaming) return;

      if (player) {
        const currentTime = player.getCurrentTime();
        setSeek(currentTime);
        updateProgressBar(trackSeekRef, `${(seek / player.getDuration()) * 100}`);
      }
    }, 1000);

    return () => clearInterval(updateCurrentTime);
  }, [playerRef, isStreaming, seek, currentPayload, setSeek]);

  if (!session) redirect("/signin");

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (playerRef.current) {
      setVolume(volumeRef, +value / 100);
    }

    if (volume.muted) {
      setVolume(volumeRef, +value / 100);
      setUnmute();
    }
    updateProgressBar(volumeRef, `${value}`);
  };

  const inputs = (
    <input
      className={styles.trackSeek}
      ref={trackSeekRef}
      type="range"
      min={0}
      value={seek || 0}
      onChange={handleSeekTrack}
      max={playerRef.current?.getDuration() || 0}
    />
  );

  const playOrPause = () => {
    return isStreaming ? <Pause onClick={handlePause} /> : <Play onClick={handlePlay} />;
  };

  // console.log(currentPayload.current, "here is the current payload");

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
            handleMute={() => toggleMute(volumeRef, savedVolumeRef)}
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
      <ReactPlayer
        ref={playerRef}
        key={currentSongRef.current?.url}
        url={playerUrl.current || ""}
        style={{ display: "none" }}
        controls={true}
        muted={volume.muted}
        volume={volume.value}
        playing={isStreaming}
        loop={repeatCurrentTrack}
        onBufferEnd={() => setIsStartingPlaying(false)}
        onEnded={handleNextTrack}
      />
    </>
  );
}
