"use client";

import { createContext, useContext, useRef } from "react";
import Hls from "hls.js";

type PlayerContext = {
  playerRef: React.RefObject<HTMLVideoElement>;
  handlePlay: () => void;
  currentTrack: React.MutableRefObject<string | null>;
  loadPlayerSource: () => void;
};

const PlayerContext = createContext<PlayerContext | null>(null);

function usePlayerContext() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }

  return context;
}

const hls = new Hls();

function PlayerProvider({ children }: { children: React.ReactNode }) {
  const playerRef = useRef<HTMLVideoElement>(null);

  const currentTrack = useRef<string | null>(null);

  const handlePlay = () => playerRef.current?.play();

  const loadPlayerSource = () => {
    if (playerRef.current === null) {
      console.log("missing player reference");
      return;
    }

    if (currentTrack.current === null) {
      console.log("no current track to load");
      return;
    }

    hls.attachMedia(playerRef.current);
    hls.loadSource(currentTrack.current);
    console.log("loadPlayerSource is finished ")
  };

  const values: PlayerContext = {
    playerRef,
    handlePlay,
    currentTrack,
    loadPlayerSource,
  };

  return <PlayerContext.Provider value={values}>{children}</PlayerContext.Provider>;
}

export { PlayerProvider, usePlayerContext };
