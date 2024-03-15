import { RefObject, useCallback, useEffect, useRef, useState } from "react";

import { updateProgressBar } from "@/music/_/utils/functions";

export function usePlayer(playerRef: RefObject<HTMLAudioElement> | RefObject<HTMLVideoElement>) {
  const volumeRef = useRef<HTMLInputElement>(null);
  const [volume, setVolume] = useState({ value: 0.3, muted: false });

  const bufferRef = useRef<HTMLInputElement>(null);
  const [bufferedTime, setBufferedTime] = useState(0);

  const trackSeekRef = useRef<HTMLInputElement>(null);
  const [seek, setSeek] = useState<number>(0);

  const handleBuffering = useCallback(() => {
    if (playerRef.current) {
      const buffered = playerRef.current.buffered;

      if (buffered.length > 0) {
        setBufferedTime(buffered.end(buffered.length - 1));
      }
    }
  }, [playerRef]);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.addEventListener("progress", handleBuffering);
      updateProgressBar(bufferRef, `${(bufferedTime / player.duration) * 100}`);
    }

    return () => {
      if (player) {
        player.removeEventListener("progress", handleBuffering);
      }
    };
  }, [bufferedTime, handleBuffering, playerRef]);

  const handleSeekTrack = (event: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = Number(event.target.value);
    const player = playerRef.current;

    if (player) {
      player.currentTime = seekTime;
      updateProgressBar(trackSeekRef, `${(seekTime / player.duration) * 100}`);
      setSeek(seekTime);
    }
  };

  useEffect(() => {
    const updateCurrentTime = setInterval(() => {
      const player = playerRef.current;

      if (player?.paused) return;

      if (player) {
        setSeek(player.currentTime);
        updateProgressBar(trackSeekRef, `${(player.currentTime / player.duration) * 100}`);
      }
    }, 1000);

    return () => clearInterval(updateCurrentTime);
  }, [playerRef]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    updateProgressBar(volumeRef, `${value}`);
    const newVolume = Number(value);

    if (playerRef.current) {
      playerRef.current.muted = false;
      const updatedVolume = Number((newVolume / 100).toFixed(2));
      playerRef.current.volume = updatedVolume;
      setVolume({ muted: false, value: updatedVolume });
    }
  };

  const handleMute = () => {
    if (playerRef.current) {
      playerRef.current.muted = !playerRef.current.muted;
      setVolume((prev) => ({ ...prev, muted: !volume.muted }));

      if (playerRef.current.muted) {
        updateProgressBar(volumeRef, `${0}`);
      } else {
        updateProgressBar(volumeRef, `${playerRef.current.volume * 100}`);
      }
    }
  };

  useEffect(() => {
    const initialVolume = 0.3;

    updateProgressBar(volumeRef, `${initialVolume * 100}`);
  }, [volumeRef]);

  return {
    handleBuffering,
    handleSeekTrack,
    handleVolumeChange,
    handleMute,
    volumeRef,
    volume,
    setBufferedTime,
    bufferRef,
    bufferedTime,
    trackSeekRef,
    setSeek,
    seek,
  };
}
