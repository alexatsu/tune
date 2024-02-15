import { Song } from "@/app/(music)/_/types";
import { RefObject } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type PlayerStore = {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  currentSong: Song | undefined;
  setCurrentSong: (value: Song | undefined) => void;
  handlePlay: (playerRef: RefObject<HTMLVideoElement>) => void;
  handlePause: (playerRef: RefObject<HTMLVideoElement>) => void;
};

const usePlayerStore = create<PlayerStore>()(
  immer((set) => ({
    isPlaying: false,
    setIsPlaying: (value) =>
      set((state) => {
        state.isPlaying = value;
      }),

    currentSong: undefined,
    setCurrentSong: (value) =>
      set((state) => {
        state.currentSong = value;
      }),
    handlePlay: (playerRef) =>
      set((state) => {
        playerRef.current?.play();
        state.isPlaying = true;
      }),
    handlePause: (playerRef) =>
      set((state) => {
        playerRef.current?.pause();
        state.isPlaying = false;
      }),
  }))
);

export { usePlayerStore };
