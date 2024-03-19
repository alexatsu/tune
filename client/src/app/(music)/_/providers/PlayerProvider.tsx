"use client";

import Hls from "hls.js";
import { createContext, useContext, useRef } from "react";

import type { Song } from "../types";

type PlayerContext = {
  playerRef: React.RefObject<HTMLVideoElement>;
  currentSongRef: React.MutableRefObject<Song | null>;
  loadPlayerSource: () => void;
};

const PlayerContext = createContext<PlayerContext | null>(null);
const hls = new Hls();

function usePlayerContext() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }

  return context;
}

function PlayerProvider({ children }: { children: React.ReactNode }) {
  const playerRef = useRef<HTMLVideoElement>(null);
  const currentSongRef = useRef<Song | null>(null);

  const loadPlayerSource = () => {
    if (playerRef.current === null) {
      console.log("missing player reference");
      return;
    }

    if (currentSongRef.current === null) {
      console.log("no current track to load");
      return;
    }

    console.log(currentSongRef.current, "here is the current track in load source");
    const { storage, urlId } = currentSongRef.current;
    hls.attachMedia(playerRef.current);
    hls.loadSource(`http://localhost:8000/audio/${storage}/${urlId}/index.m3u8`);
    console.log("loadPlayerSource is finished ");
  };

  const values: PlayerContext = {
    playerRef,
    currentSongRef,
    loadPlayerSource,
  };

  return <PlayerContext.Provider value={values}>{children}</PlayerContext.Provider>;
}

export { PlayerProvider, usePlayerContext };
