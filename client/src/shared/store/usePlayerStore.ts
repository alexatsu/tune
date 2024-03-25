import { RefObject } from "react";
import { create } from "zustand";

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

const usePlayerStore = create<PlayerStore>((set) => ({
  isPlaying: false,
  setIsPlaying: (value) => set({ isPlaying: value }),

  currentSong: undefined,
  setCurrentSong: (value) => set({ currentSong: value }),

  handlePlay: (playerRef) => {
    set((state) => {
      const player = playerRef.current;

      if (player && player.readyState >= 2) {
        player.play();
        return { isPlaying: true };
      } else {
        const canPlayHandler = async () => {
          await player?.play();
          set({ isPlaying: true });
        };

        player?.addEventListener("canplay", canPlayHandler);

        return {
          isPlaying: state.isPlaying,
          removeCanPlayListener: () => player?.removeEventListener("canplay", canPlayHandler),
        };
      }
    });
  },

  handlePause: (playerRef) => {
    set((state) => {
      if (state.isPlaying && !playerRef.current?.paused) {
        playerRef.current?.pause();
        return { isPlaying: false };
      }
      return state;
    });
  },

  loadPlayerSource: (playerRef, song) => {
    set((state) => {
      if (playerRef.current) {
        playerRef.current.src = song.url;
        playerRef.current.load();
      }
      return state;
    });
  },
}));

export { usePlayerStore };
