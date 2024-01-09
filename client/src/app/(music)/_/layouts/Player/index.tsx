"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Hls from "hls.js";

import { usePlayerContext } from "../../providers";

import styles from "./styles.module.scss";
import { useSession } from "next-auth/react";

//TODO:
// - error handling
// - loading states
// - make play/pause changing
// - connect to api
// - move some player states to global state

// const apiUrl = "http://localhost:8000/audio/saved/";
// const sources = [
//   `${apiUrl}Traitors/index.m3u8`,
//   `${apiUrl}NF - The Search/index.m3u8`,
//   `${apiUrl}ONICKS - ＂Illuminati＂ (Official Lyric Video)/index.m3u8`,
//   `${apiUrl}Unholy (Sam Smith) 【covered by Anna ft. @chloebreez】｜ dual POV ver/index.m3u8`,
// ];

const hls = new Hls();

export function Player() {
  const { playerRef, handlePlay, currentTrack, loadPlayerSource } = usePlayerContext();
  const { data: session } = useSession();
  // const { test, setTest } = usePlayerStore();
  // const playerRef = useRef<HTMLVideoElement>(null);
  const sources = useRef<string[]>([]);
  // const currentTrack = useRef<string | null>(null);
  const [time, setTime] = useState({
    current: 0,
    buffered: 0,
  });

  const [volume, setVolume] = useState<number>(0.3);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [seek, setSeek] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const response = await fetch(`http://localhost:3000/api/songs/get-all/${session?.user?.email}`);
      const data = await response.json();

      sources.current = data.songs;
      currentTrack.current = data.songs[0];

      console.log(sources.current, "sources");
      console.log(currentTrack.current, "current track");

      hls.attachMedia(playerRef.current as HTMLVideoElement);
      hls.loadSource(sources.current[0]);

      hls.on(Hls.Events.MEDIA_ATTACHED, function () {
        console.log("video and hls.js are now bound together !");
      });

      hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        console.log("manifest loaded, found " + data.levels.length + " quality level");
      });
    })();

    return () => hls.destroy();
  }, [playerRef, sources, currentTrack, session]);

  // const loadPlayerSource = useCallback(async () => {
  //   if (playerRef.current === null) {
  //     console.log("missing player reference");
  //     return;
  //   }

  //   if (currentTrack.current === null) {
  //     console.log("no current track to load");
  //     return;
  //   }

  //   hls.attachMedia(playerRef.current);
  //   hls.loadSource(currentTrack.current);
  // }, [playerRef]);

  // const handlePlay = () => playerRef.current?.play();

  const handlePause = () => playerRef.current?.pause();

  const handleNextTrack = useCallback(() => {
    if (currentTrack.current === null) {
      console.log("no current next track");
      return;
    }

    const source = sources.current;

    const trackIndex = source.indexOf(currentTrack.current);

    if (trackIndex === source.length - 1) {
      currentTrack.current = source[0];
    }

    if (trackIndex < source.length - 1) {
      currentTrack.current = source[trackIndex + 1];
    }

    loadPlayerSource();
    handlePlay();
  }, [currentTrack, loadPlayerSource, handlePlay]);

  const handlePreviousTrack = () => {
    if (currentTrack.current === null) {
      console.log("no current previous track");
      return;
    }

    const source = sources.current;

    const trackIndex = source.indexOf(currentTrack.current);

    if (trackIndex === 0) {
      currentTrack.current = source[source.length - 1];
    }

    if (trackIndex > 0) {
      currentTrack.current = source[trackIndex - 1];
    }

    loadPlayerSource();
    handlePlay();
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
      if (playerRef.current?.paused) {
        return;
      }

      setTime((prev) => ({ ...prev, current: playerRef.current?.currentTime || 0 }));

      setSeek(playerRef.current?.currentTime || 0);
    }, 1000);

    return () => clearInterval(updateCurrentTime);
  }, [playerRef]);

  useEffect(() => {
    const handleBuffering = () => {
      if (playerRef.current) {
        const buffered = playerRef.current.buffered; // current buffer chunks
        if (buffered.length > 0) {
          //buffered.end(buffered.length - 1)
          //is the end time of the last buffer chunk in seconds
          setTime((prev) => ({
            ...prev,
            buffered: buffered.end(buffered.length - 1),
          }));
        }
      }
    };

    hls.on(Hls.Events.BUFFER_APPENDED, handleBuffering);

    return () => hls.off(Hls.Events.BUFFER_APPENDED, handleBuffering);
  }, [playerRef]);

  const handleMute = () => {
    if (playerRef.current) {
      playerRef.current.muted = !playerRef.current.muted;

      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume = 0.3;
    }
  }, [playerRef]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(event.target.value);

    if (playerRef.current) {
      const updatedVolume = Number((newVolume / 100).toFixed(2));
      playerRef.current.volume = updatedVolume;

      setVolume(updatedVolume);
    }
  };

  const handleSeekTrack = (event: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = Number(event.target.value);

    if (playerRef.current) {
      playerRef.current.currentTime = seekTime;

      setSeek(seekTime);
      setTime((prev) => ({ ...prev, current: seekTime }));
    }
  };

  return (
    <div className={styles.playerContainer}>
      <button onClick={handlePlay}>Play</button>

      <button onClick={handlePause}>Pause</button>
      <button onClick={handleNextTrack}>PlayNext</button>
      <button onClick={handlePreviousTrack}>PlayPrevious</button>
      <button onClick={handleMute}>Mute</button>
      <input type="range" value={isMuted ? 0 : volume * 100} onChange={handleVolumeChange} />

      <progress value={time.current} max={playerRef.current?.duration}></progress>
      <progress value={time.buffered} max={playerRef.current?.duration}></progress>

      <input
        type="range"
        min={0}
        max={playerRef.current?.duration}
        value={seek}
        onChange={handleSeekTrack}
      />
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
