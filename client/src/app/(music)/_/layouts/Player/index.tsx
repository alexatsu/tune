"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import Hls from "hls.js";

import { playerIcons } from "../../components/icons/player";
import { usePlayerContext } from "../../providers";
import { useSongs } from "../../hooks";

import styles from "./styles.module.scss";
import { usePlayerStore } from "@/shared/store";

// TODO:
// - loading states
// - error handling

const hls = new Hls();
const { Unmuted, Muted, Play, Pause, PreviousTrack, NextTrack } = playerIcons;

const convertStringDurationToNumber = (duration: string | undefined) => {
  if (!duration) return 0;

  const [hours, minutes, seconds] = duration.split(":");
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
};

export function Player() {
  const { data: session } = useSession();
  const { playerRef, currentTrack, loadPlayerSource } = usePlayerContext();
  const { isPlaying, handlePause, handlePlay } = usePlayerStore();

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

  const { data, error, isLoading, songs } = useSongs(session);
  const { setCurrentSong } = usePlayerStore();
  const duration = convertStringDurationToNumber(currentTrack.current?.duration);


  useEffect(() => {
    if (!data) return;
    currentTrack.current = data.songs[0];
    console.log(currentTrack.current, "current track");
    setCurrentSong(data.songs[0]);

    const { storage, urlId } = currentTrack.current || {};
    hls.attachMedia(playerRef.current as HTMLVideoElement);
    hls.loadSource(`http://localhost:8000/audio/${storage}/${urlId}/index.m3u8`);

    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      console.log("video and hls.js are now bound together !");
    });

    hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      console.log("manifest loaded, found " + data.levels.length + " quality level");
    });

    return () => hls.destroy();
  }, [currentTrack, playerRef, data, setCurrentSong]);

  const handleNextTrack = useCallback(() => {
    setSeek(0);
    trackSeekRef.current!.style.background = `linear-gradient(to right, var(--accent) ${
      (0 / duration) * 100
    }%, var(--white-fade) ${(0 / duration) * 100}%)`;

    if (currentTrack.current === undefined) {
      console.log("no current next track");
      return;
    }

    if (!songs) {
      console.log("no source to handle next track");
      return;
    }

    const trackIndex = songs.indexOf(currentTrack.current);

    if (trackIndex === songs.length - 1) {
      currentTrack.current = songs[0];
      setCurrentSong(songs[0]);
    }

    if (trackIndex < songs.length - 1) {
      currentTrack.current = songs[trackIndex + 1];
      setCurrentSong(songs[trackIndex + 1]);
    }

    loadPlayerSource();
    handlePlay(playerRef);
  }, [currentTrack, handlePlay, loadPlayerSource, songs, duration, setCurrentSong, playerRef]);

  const handlePreviousTrack = () => {
    if (currentTrack.current === undefined) {
      console.log("no current previous track");
      return;
    }

    if (!songs) {
      console.log("no source to handle previous track");
      return;
    }
    const trackIndex = songs.indexOf(currentTrack.current);

    if (trackIndex === 0) {
      currentTrack.current = songs[songs.length - 1];
      setCurrentSong(songs[songs.length - 1]);
    }

    if (trackIndex > 0) {
      currentTrack.current = songs[trackIndex - 1];
      setCurrentSong(songs[trackIndex - 1]);
    }

    setSeek(0);
    trackSeekRef.current!.style.background = `linear-gradient(to right, var(--accent) ${
      (0 / duration) * 100
    }%, var(--white-fade) ${(0 / duration) * 100}%)`;

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
        trackSeekRef.current!.style.background = `linear-gradient(to right, var(--accent) ${
          (player.currentTime / duration) * 100
        }%, var(--white-fade) ${(player.currentTime / duration) * 100}%)`;
      }
    }, 1000);

    return () => clearInterval(updateCurrentTime);
  }, [playerRef, seek, duration]);

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
    if (player && data) {
      player.addEventListener("progress", handleBuffering);
      bufferRef.current!.style.background = `linear-gradient(to right, var(--accent) ${
        (time.buffered / duration) * 100
      }%, var(--white-fade) ${(time.buffered / duration) * 100}%)`;
    }

    return () => {
      if (player && data) {
        player.removeEventListener("progress", handleBuffering);
      }
    };
  }, [playerRef, handleBuffering, data, time.buffered, duration]);

  useEffect(() => {
    const initialVolume = 0.3;

    if (data && playerRef.current) {
      playerRef.current.volume = initialVolume;
    }

    if (volumeRef.current) {
      volumeRef.current!.style.background = `linear-gradient(to right, var(--accent) 
      ${initialVolume * 100}%, var(--white-fade) ${initialVolume * 100}%)`;
    }
  }, [playerRef, data, volumeRef]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    volumeRef.current!.style.background = `linear-gradient(to right, var(--accent) ${value}%, var(--white-fade) ${value}%)`;

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
        volumeRef.current!.style.background =
          "linear-gradient(to right, var(--accent) 100%, var(--accent) 100%)`";
      } else {
        const prevVolume = playerRef.current.volume * 100;
        volumeRef.current!.style.background = `linear-gradient(to right, var(--accent) ${prevVolume}%, var(--white-fade) ${prevVolume}%)`;
      }
    }
  };

  const handleSeekTrack = (event: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = Number(event.target.value);

    if (playerRef.current) {
      playerRef.current.currentTime = seekTime;

      trackSeekRef.current!.style.background = `linear-gradient(to right, var(--accent) ${
        (seekTime / duration) * 100
      }%, var(--white-fade) ${(seekTime / duration) * 100}%)`;
      setSeek(seekTime);
    }
  };

  return (
    <div className={styles.playerContainer}>
      <div className={styles.titleBlock}>
        <Image
          src={`http://localhost:8000/audio/saved/${currentTrack?.current?.urlId}/thumbnail.jpg`}
          alt="cover"
          width={50}
          height={50}
          unoptimized
        />
        <div className={styles.title}>{currentTrack.current?.title}</div>
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

      <video
        style={{ display: "none" }}
        ref={playerRef}
        controls
        width={320}
        height={240}
        id="video"
      ></video>
    </div>
  );
}
