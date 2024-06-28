"use client";

import { createContext, MutableRefObject, RefObject, useContext, useRef } from "react";

import type { AlbumSongs, ChartSongs, Song } from "@/music/_/types";
import { Stream } from "@/music/_/types";

type PlayerContext = {
  playerRef: RefObject<HTMLIFrameElement>;
  volumeRef: React.RefObject<HTMLInputElement>;
  currentSongOrStreamRef: MutableRefObject<Song | Stream | null>;
  currentPayload: MutableRefObject<{
    songsOrStreams: (Song | Stream | AlbumSongs | ChartSongs)[];
    type: string | undefined;
    id?: string;
  } | null>;
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
  const playerRef = useRef<HTMLIFrameElement | null>(null);
  const currentSongOrStreamRef = useRef<Song | Stream | null>(null);
  const volumeRef = useRef<HTMLInputElement>(null);
  const currentPayload = useRef(null);

  const values: PlayerContext = {
    playerRef,
    currentSongOrStreamRef,
    volumeRef,
    currentPayload,
  };

  return <PlayerContext.Provider value={values}>{children}</PlayerContext.Provider>;
}

export { PlayerProvider, usePlayerContext };
