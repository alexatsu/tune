"use client";

import { RefObject, createContext, useContext, useRef } from "react";

import type { Song } from "../../(music)/_/types";

type PlayerContext = {
  playerRef: RefObject<HTMLAudioElement>;
  currentSongRef: React.MutableRefObject<Song | null>;
};

const PlayerContext = createContext<PlayerContext | null>(null);

function usePlayerContext() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }

  return context;
}

function PlayerProvider({ children }: { children: React.ReactNode }) {
  const playerRef = useRef(new Audio())
  const currentSongRef = useRef<Song | null>(null);

  const values: PlayerContext = {
    playerRef,
    currentSongRef,
  };

  return <PlayerContext.Provider value={values}>{children}</PlayerContext.Provider>;
}

export { PlayerProvider, usePlayerContext };
