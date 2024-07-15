"use client";

import { createContext, MutableRefObject, RefObject, useContext, useRef } from "react";
import ReactPlayer from "react-player";

import type { AlbumSongs, ChartSongs, Song } from "@/music/_/types";
import { Stream } from "@/music/_/types";

type CurrentPayload = {
  songsOrStreams: (Song | Stream | AlbumSongs | ChartSongs)[];
  type: string | undefined;
  id?: string;
} | null;

type PlayerContext = {
  playerRef: RefObject<ReactPlayer>;
  playerUrl: MutableRefObject<string | null>;
  volumeRef: React.RefObject<HTMLInputElement>;
  currentSongOrStreamRef: MutableRefObject<Song | Stream | null>;
  currentPayload: MutableRefObject<CurrentPayload>;
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
  const playerRef = useRef<ReactPlayer | null>(null);
  const playerUrl = useRef<string>(null);
  const currentSongOrStreamRef = useRef<Song | Stream | null>(null);
  const volumeRef = useRef<HTMLInputElement>(null);
  const currentPayload = useRef(null);

  const values: PlayerContext = {
    playerRef,
    playerUrl,
    currentSongOrStreamRef,
    volumeRef,
    currentPayload,
  };

  return <PlayerContext.Provider value={values}>{children}</PlayerContext.Provider>;
}

export { PlayerProvider, usePlayerContext };
export type { CurrentPayload };
