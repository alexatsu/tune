"use client";

import { Dispatch, SetStateAction, createContext, useContext, useRef, useState } from "react";
import Hls from "hls.js";

import type { Song } from "../types";

type PlayerContext = {
  playerRef: React.RefObject<HTMLVideoElement>;
  handlePlay: () => void;
  handlePlayById: (song: Song) => void;
  handlePause: () => void;
  currentTrack: React.MutableRefObject<Song | undefined>;
  loadPlayerSource: () => void;
  isPlaying: boolean;
  setCurrentState: Dispatch<SetStateAction<Song | undefined>>;
  currentState: Song | undefined;
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
  const [isPlaying, setIsPlaying] = useState(false);
  const currentTrack = useRef<Song | undefined>(undefined);
  const [currentState, setCurrentState] = useState<Song | undefined>(undefined);

  const handlePlay = () => {
    playerRef.current?.play();
    setIsPlaying(true);
  };

  const handlePlayById = (song: Song) => {
    currentTrack.current = song;
    setCurrentState(song);
    loadPlayerSource();
    playerRef.current?.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    playerRef.current?.pause();
    setIsPlaying(false);
  };

  const loadPlayerSource = () => {
    if (playerRef.current === null) {
      console.log("missing player reference");
      return;
    }

    if (currentTrack.current === null) {
      console.log("no current track to load");
      return;
    }

    console.log(currentTrack.current, "here is the current track in load source");
    const { storage, urlId } = currentTrack.current as Song;
    hls.attachMedia(playerRef.current);
    hls.loadSource(`http://localhost:8000/audio/${storage}/${urlId}/index.m3u8`);
    console.log("loadPlayerSource is finished ");
  };

  const values: PlayerContext = {
    playerRef,
    handlePlay,
    handlePlayById,
    handlePause,
    currentTrack,
    loadPlayerSource,
    isPlaying,
    setCurrentState,
    currentState,
  };

  return <PlayerContext.Provider value={values}>{children}</PlayerContext.Provider>;
}

export { PlayerProvider, usePlayerContext };
