"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Hls from "hls.js";
import styles from "./styles.module.scss";

//TODO:
// - error handling
// - loading states
// - make play/pause changing
// - connect to api
// - move some player states to global state

const apiUrl = "http://localhost:8000/audio/saved/";
const sources = [
  `${apiUrl}NF - The Search/index.m3u8`,
  `${apiUrl}ONICKS - ＂Illuminati＂ (Official Lyric Video)/index.m3u8`,
  `${apiUrl}Unholy (Sam Smith) 【covered by Anna ft. @chloebreez】｜ dual POV ver/index.m3u8`,
];

const hls = new Hls();

export function Player() {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const currentTrack = useRef(sources[0]);
  const [time, setTime] = useState({
    current: 0,
    buffered: 0,
  });

  const [volume, setVolume] = useState<number>(0.3);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [seek, setSeek] = useState<number>(0);

  const loadPlayerSource = useCallback(() => {
    hls.loadSource(currentTrack.current);

    if (playerRef.current) {
      hls.attachMedia(playerRef.current);
    }
  }, []);

  useEffect(() => {
    hls.on(Hls.Events.MEDIA_ATTACHED, function () {
      console.log("video and hls.js are now bound together !");
    });

    hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
      console.log("manifest loaded, found " + data.levels.length + " quality level");
    });

    loadPlayerSource();

    return () => hls.destroy();
  }, [loadPlayerSource]);

  const handlePlay = () => {
    playerRef.current?.play();
  };

  const handlePause = () => {
    playerRef.current?.pause();
  };

  const handleNextTrack = useCallback(() => {
    const trackIndex = sources.indexOf(currentTrack.current);

    if (trackIndex === sources.length - 1) {
      currentTrack.current = sources[0];
    }

    if (trackIndex < sources.length - 1) {
      currentTrack.current = sources[trackIndex + 1];
    }

    loadPlayerSource();
    handlePlay();
  }, [loadPlayerSource]);

  const handlePreviousTrack = () => {
    const trackIndex = sources.indexOf(currentTrack.current);

    if (trackIndex === 0) {
      currentTrack.current = sources[sources.length - 1];
    }

    if (trackIndex > 0) {
      currentTrack.current = sources[trackIndex - 1];
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
  }, [handleNextTrack]);

  useEffect(() => {
    const updateCurrentTime = setInterval(() => {
      if (playerRef.current?.paused) {
        return;
      }

      setTime((prev) => ({
        ...prev,
        current: playerRef.current?.currentTime || 0,
      }));

      setSeek(playerRef.current?.currentTime || 0);
    }, 1000);

    return () => clearInterval(updateCurrentTime);
  }, []);

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
  }, []);

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
  }, []);

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
