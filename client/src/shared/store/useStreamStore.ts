import { RefObject } from "react";
import { create } from "zustand";

import { updateProgressBar } from "@/music/_/utils/functions";

type StreamStore = {
  currentId: string;
  setCurrentId: (value: string) => void;

  isStreaming: boolean;
  setIsStreaming: (value: boolean) => void;
  handleLoad: (streamRef: RefObject<HTMLIFrameElement>) => void;
  handlePlay: (streamRef: RefObject<HTMLIFrameElement>, volume: number) => void;
  handlePause: (streamRef: RefObject<HTMLIFrameElement>) => void;

  volume: {
    value: number;
    muted: boolean;
  };
  setVolume: (volumeRef: RefObject<HTMLInputElement>, value: number) => void;
  toggleMute: (
    streamRef: RefObject<HTMLIFrameElement>,
    volumeRef: RefObject<HTMLInputElement>,
  ) => void;
  handleVolume: (streamRef: RefObject<HTMLIFrameElement>, volume: number) => void;
};

const useStreamStore = create<StreamStore>((set, get) => ({
  currentId: "",
  setCurrentId: (value) => set({ currentId: value }),

  isStreaming: false,
  setIsStreaming: (value) => set({ isStreaming: value }),
  handleLoad: (streamRef) => {
    if (streamRef.current) {
      streamRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"loadVideoById","args":["' + get().currentId + '"]}',
        "*",
      );
    }
  },

  handlePlay: (streamRef, volume) => {
    if (streamRef.current) {
      streamRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        "*",
      );
      streamRef.current.contentWindow?.postMessage(
        `{"event":"command","func":"setVolume","args":["${volume}"]}`,
        "*",
      );
      set({ isStreaming: true });
    }
  },

  handlePause: (streamRef) => {
    if (streamRef.current) {
      streamRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*",
      );
      set({ isStreaming: false });
    }
  },
  volume: {
    value: 0.3,
    muted: false,
  },

  setVolume: (volumeRef, value) => {
    updateProgressBar(volumeRef, `${value * 100}`);
    set({ volume: { ...get().volume, value } });
  },

  toggleMute: (streamRef, volumeRef) => {
    if (streamRef.current && !get().volume.muted) {
      streamRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"mute","args":""}',
        "*",
      );
      updateProgressBar(volumeRef, `${0}`);
      set((state) => ({
        volume: { ...state.volume, muted: true },
      }));
    } else {
      streamRef.current?.contentWindow?.postMessage(
        '{"event":"command","func":"unMute","args":""}',
        "*",
      );
      updateProgressBar(volumeRef, `${get().volume.value * 100}`);
      set((state) => ({
        volume: { ...state.volume, muted: false },
      }));
    }
  },

  handleVolume: (streamRef, volume) => {
    if (streamRef.current) {
      streamRef.current.contentWindow?.postMessage(
        `{"event":"command","func":"setVolume","args":["${volume}"]}`,
        "*",
      );
    }
  },
}));

export { useStreamStore };
