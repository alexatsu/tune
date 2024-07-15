import { MutableRefObject, RefObject } from "react";
import { create } from "zustand";

import { updateProgressBar } from "@/music/_/utils/functions";

type StreamStore = {
  currentId: string;
  setCurrentId: (value: string) => void;

  isStreaming: boolean;
  setIsStreaming: (value: boolean) => void;
  isStartingPlaying: boolean;
  setIsStartingPlaying: (value: boolean) => void;
  handlePlay: () => void;
  handlePause: () => void;

  volume: {
    value: number;
    muted: boolean;
  };
  setVolume: (volumeRef: RefObject<HTMLInputElement>, value: number) => void;
  setUnmute: () => void;
  toggleMute: (
    volumeRef: RefObject<HTMLInputElement>,
    savedVolumeRef: MutableRefObject<number>,
  ) => void;
  seek: number;
  setSeek: (value: number) => void;
};

const useStreamStore = create<StreamStore>((set, get) => ({
  currentId: "",
  setCurrentId: (value) => set({ currentId: value }),

  isStreaming: false,
  setIsStreaming: (value) => set({ isStreaming: value }),
  isStartingPlaying: false,
  setIsStartingPlaying: (value) => set({ isStartingPlaying: value }),

  handlePlay: () => {
    set({ isStreaming: true });
  },

  handlePause: () => {
    set({ isStreaming: false });
  },
  volume: {
    value: 0.3,
    muted: false,
  },

  setVolume: (volumeRef, value) => {
    updateProgressBar(volumeRef, `${value * 100}`);
    set({ volume: { ...get().volume, value } });
  },

  setUnmute: () => {
    set({ volume: { ...get().volume, muted: false } });
  },
  toggleMute: (volumeRef, savedVolumeRef) => {
    if (!get().volume.muted) {
      savedVolumeRef.current = get().volume.value;
      updateProgressBar(volumeRef, `${0}`);
      set((state) => ({
        volume: { value: 0, muted: true },
      }));
    } else {
      updateProgressBar(volumeRef, `${get().volume.value * 100}`);
      set((state) => ({
        volume: { value: savedVolumeRef.current, muted: false },
      }));
    }
  },

  seek: 0,
  setSeek: (value) => set({ seek: value }),
}));

export { useStreamStore };
