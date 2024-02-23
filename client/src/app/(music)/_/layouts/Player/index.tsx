"use client";

import { useState, useEffect, useCallback, useRef, RefObject, useMemo } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import Hls from "hls.js";

import { playerIcons } from "@/music/_/components/icons/player";
import { usePlayerContext } from "@/music/_/providers";
import { useMobile, useSongs } from "@/music/_/hooks";

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

const updateProgressBar = (ref: RefObject<HTMLInputElement>, value: string) => {
  ref.current!.style.background = `
  linear-gradient(to right, 
  var(--accent) ${value}%, 
  var(--white-fade) ${value}%)`;
};

export function Player() {
  const { data: session } = useSession();
  const { playerRef, currentSongRef, loadPlayerSource } = usePlayerContext();
  const { isPlaying, handlePause, handlePlay, setCurrentSong } = usePlayerStore();
  const { error, isLoading, songs } = useSongs(session);

  const isMobile = useMobile(576);

  const [time, setTime] = useState({
    current: 0,
    buffered: 0,
  });

  const volumeRef = useRef<HTMLInputElement>(null);
  const [volume, setVolume] = useState<number>(0.3);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const trackSeekRef = useRef<HTMLInputElement>(null);
  const bufferRef = useRef<HTMLInputElement>(null);
  const [seek, setSeek] = useState<number>(0);

  const duration = convertStringDurationToNumber(currentSongRef.current?.duration);

  useEffect(() => {
    if (!songs) return;
    currentSongRef.current = songs[0];
    console.log(currentSongRef.current, "current track");
    setCurrentSong(songs[0]);

    const { storage, urlId } = currentSongRef.current;
    if (playerRef.current) {
      hls.attachMedia(playerRef.current);
      hls.loadSource(`http://localhost:8000/audio/${storage}/${urlId}/index.m3u8`);
    }

    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      console.log("video and hls.js are now bound together !");
    });

    hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      console.log("manifest loaded, found " + data.levels.length + " quality level");
    });

    return () => hls.destroy();
  }, [currentSongRef, playerRef, songs, setCurrentSong]);

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
  }, [currentSongRef, handlePlay, loadPlayerSource, songs, duration, setCurrentSong, playerRef]);

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
    const updateCurrentTime = setInterval(() => {
      const player = playerRef.current;

      if (player?.paused) return;

      if (player) {
        setSeek(player.currentTime);
        updateProgressBar(trackSeekRef, `${(player.currentTime / duration) * 100}`);
      }
    }, 1000);

    return () => clearInterval(updateCurrentTime);
  }, [playerRef, duration]);

  const handleBuffering = useCallback(() => {
    if (playerRef.current) {
      const buffered = playerRef.current.buffered;

      if (buffered.length > 0) {
        setTime((prev) => ({
          ...prev,
          buffered: buffered.end(buffered.length - 1),
        }));
      }
    }
  }, [playerRef]);

  useEffect(() => {
    const player = playerRef.current;
    if (player && songs) {
      player.addEventListener("progress", handleBuffering);
      updateProgressBar(bufferRef, `${(time.buffered / duration) * 100}`);
    }

    return () => {
      if (player && songs) {
        player.removeEventListener("progress", handleBuffering);
      }
    };
  }, [playerRef, handleBuffering, songs, time.buffered, duration]);

  useEffect(() => {
    const initialVolume = 0.3;

    if (songs && playerRef.current) {
      playerRef.current.volume = initialVolume;
    }

    if (volumeRef.current && !isMobile) {
      updateProgressBar(volumeRef, `${initialVolume * 100}`);
      console.log(initialVolume, "here is the initial volume");
    }
  }, [playerRef, songs, volumeRef, isMobile]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    updateProgressBar(volumeRef, `${value}`);
    const newVolume = Number(value);

    if (playerRef.current) {
      playerRef.current.muted = false;
      setIsMuted(false);
      const updatedVolume = Number((newVolume / 100).toFixed(2));
      playerRef.current.volume = updatedVolume;
      setVolume(updatedVolume);
    }
  };

  const handleMute = () => {
    if (playerRef.current) {
      playerRef.current.muted = !playerRef.current.muted;

      setIsMuted(!isMuted);

      if (playerRef.current.muted) {
        updateProgressBar(volumeRef, `${0}`);
      } else {
        updateProgressBar(volumeRef, `${playerRef.current.volume * 100}`);
      }
    }
  };

  const handleSeekTrack = (event: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = Number(event.target.value);

    if (playerRef.current) {
      playerRef.current.currentTime = seekTime;
      updateProgressBar(trackSeekRef, `${(seekTime / duration) * 100}`);
      setSeek(seekTime);
    }
  };

  return (
    <>
      {!isMobile ? (
        <div className={styles.playerContainer}>
          <div className={styles.titleBlock}>
            <Image
              src={`http://localhost:8000/audio/saved/${currentSongRef?.current?.urlId}/thumbnail.jpg`}
              alt="cover"
              width={50}
              height={50}
              unoptimized
            />
            <div className={styles.title}>{currentSongRef.current?.title}</div>
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

            <div className={styles.inputs}>
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
                defaultValue={time.buffered}
                max={duration}
              />
            </div>
          </div>

          <div className={styles.sound}>
            {isMuted ? (
              <Muted role={"button"} style={{ cursor: "pointer" }} onClick={handleMute} />
            ) : (
              <Unmuted role={"button"} style={{ cursor: "pointer" }} onClick={handleMute} />
            )}

            <input
              className={styles.volume}
              ref={volumeRef}
              type="range"
              value={isMuted ? 0 : volume * 100}
              onChange={handleVolumeChange}
            />
          </div>
        </div>
      ) : (
        <div className={styles.mobilePlayerContainer}>
          <div className={styles.inputs}>
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
              defaultValue={time.buffered}
              max={duration}
            />
          </div>

          <div className={styles.main}>
            <div className={styles.imageBlock}>
              <Image
                src={`http://localhost:8000/audio/saved/${currentSongRef?.current?.urlId}/thumbnail.jpg`}
                alt="cover"
                width={35}
                height={35}
                unoptimized
              />
              {isPlaying ? (
                <Pause onClick={() => handlePause(playerRef)} />
              ) : (
                <Play onClick={() => handlePlay(playerRef)} />
              )}
            </div>

            <div className={styles.title}>{currentSongRef.current?.title}</div>
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
