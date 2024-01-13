"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import Hls from "hls.js";

import { SongsResponse } from "../../types";
import { usePlayerContext } from "../../providers";

import styles from "./styles.module.scss";

//TODO:
// - loading states
// - make play/pause changing
// - error handling

const hls = new Hls();

export function Player() {
  const { data: session } = useSession();
  const { playerRef, handlePlay, currentTrack, loadPlayerSource } = usePlayerContext();
  const sources = useRef<SongsResponse["songs"] | null>([]);
  const [time, setTime] = useState({
    current: 0,
    buffered: 0,
  });

  const [volume, setVolume] = useState<number>(0.3);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [seek, setSeek] = useState<number>(0);

  const fetchAllMusic = async () => {
    const response = await fetch("http://localhost:3000/api/songs/get-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session?.user?.email }),
    });

    return response.json();
  };

  const { data, error, isLoading } = useSWR<SongsResponse>(
    `http://localhost:3000/api/songs/get-all`,
    fetchAllMusic,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (!data) return;
    sources.current = data.songs;
    currentTrack.current = data.songs[0];

    console.log(sources.current, "sources");
    console.log(currentTrack.current, "current track");

    const { storage, urlId } = currentTrack.current;
    hls.attachMedia(playerRef.current as HTMLVideoElement);
    hls.loadSource(`http://localhost:8000/audio/${storage}/${urlId}/index.m3u8`);

    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      console.log("video and hls.js are now bound together !");
    });

    hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      console.log("manifest loaded, found " + data.levels.length + " quality level");
    });

    return () => hls.destroy();
  }, [currentTrack, playerRef, data]);

  const handlePause = () => playerRef.current?.pause();

  const handleNextTrack = useCallback(() => {
    if (currentTrack.current === undefined) {
      console.log("no current next track");
      return;
    }

    if (!sources.current) {
      console.log("no source to handle next track");
      return;
    }

    const trackIndex = sources.current.indexOf(currentTrack.current);

    if (trackIndex === sources.current.length - 1) {
      currentTrack.current = sources.current[0];
    }

    if (trackIndex < sources.current.length - 1) {
      currentTrack.current = sources.current[trackIndex + 1];
    }

    loadPlayerSource();
    handlePlay();
  }, [currentTrack, loadPlayerSource, handlePlay]);

  const handlePreviousTrack = () => {
    if (currentTrack.current === undefined) {
      console.log("no current previous track");
      return;
    }

    if (!sources.current) {
      console.log("no source to handle previous track");
      return;
    }
    const trackIndex = sources.current.indexOf(currentTrack.current);

    if (trackIndex === 0) {
      currentTrack.current = sources.current[sources.current.length - 1];
    }

    if (trackIndex > 0) {
      currentTrack.current = sources.current[trackIndex - 1];
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
    if (player) {
      player.addEventListener("progress", handleBuffering);
    }

    return () => {
      if (player) {
        player.removeEventListener("progress", handleBuffering);
      }
    };
  }, [playerRef, handleBuffering]);

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
