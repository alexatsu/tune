import { RefObject } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { Song } from "@/app/(music)/_/types";

type PlayerStore = {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  currentSong: Song | undefined;
  setCurrentSong: (value: Song | undefined) => void;
  handlePlay: (playerRef: RefObject<HTMLVideoElement>) => void;
  handlePause: (playerRef: RefObject<HTMLVideoElement>) => void;
  loadPlayerSource: (playerRef: RefObject<HTMLAudioElement>, song: Song) => void;
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
        if (!state.isPlaying && playerRef.current?.paused) {
          // this if is workaround, because audio.play() is async
          playerRef.current?.play();
          state.isPlaying = true;
        }
      }),
    handlePause: (playerRef) =>
      set((state) => {
        if (state.isPlaying && !playerRef.current?.paused) {
          // this if is workaround, because audio.play() is async
          playerRef.current?.pause();
          state.isPlaying = false;
        }
      }),
    loadPlayerSource: (playerRef, song) =>
      set((state) => {
        if (playerRef.current) {
          playerRef.current.src = song.url;
          playerRef.current.load();
          playerRef.current.addEventListener("canplay", () => {
            playerRef.current?.play();
            playerRef.current?.removeEventListener("canplay", () => {});
          });
        }
      }),
  })),
);

export { usePlayerStore };
