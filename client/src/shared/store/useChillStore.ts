import { RefObject } from "react";
import { create } from "zustand";

import { updateProgressBar } from "@/music/_/utils/functions";

type ChillStore = {
  currentId: string;
  setCurrentId: (value: string) => void;

  isStreaming: boolean;
  setIsStreaming: (value: boolean) => void;
  handleLoad: (chillRef: RefObject<HTMLIFrameElement>) => void;
  handlePlay: (chillRef: RefObject<HTMLIFrameElement>, volume: number) => void;
  handlePause: (chillRef: RefObject<HTMLIFrameElement>) => void;

  volume: {
    value: number;
    muted: boolean;
  };
  setVolume: (volumeRef: RefObject<HTMLInputElement>, value: number) => void;
  toggleMute: (
    chillRef: RefObject<HTMLIFrameElement>,
    volumeRef: RefObject<HTMLInputElement>,
  ) => void;
  handleVolume: (chillRef: RefObject<HTMLIFrameElement>, volume: number) => void;
};

const useChillStore = create<ChillStore>((set, get) => ({
  currentId: "",
  setCurrentId: (value) => set({ currentId: value }),

  isStreaming: false,
  setIsStreaming: (value) => set({ isStreaming: value }),
  handleLoad: (chillRef) => {
    if (chillRef.current) {
      chillRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"loadVideoById","args":["' + get().currentId + '"]}',
        "*",
      );
    }
  },
  handlePlay: (chillRef, volume) => {
    if (chillRef.current) {
      chillRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        "*",
      );
      chillRef.current.contentWindow?.postMessage(
        `{"event":"command","func":"setVolume","args":["${volume}"]}`,
        "*",
      );
      set({ isStreaming: true });
    }
  },
  handlePause: (chillRef) => {
    if (chillRef.current) {
      chillRef.current.contentWindow?.postMessage(
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
  toggleMute: (chilRef, volumeRef) => {
    if (chilRef.current && !get().volume.muted) {
      chilRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"mute","args":""}',
        "*",
      );
      updateProgressBar(volumeRef, `${0}`);
      set((state) => ({
        volume: { ...state.volume, muted: true },
      }));
    } else {
      chilRef.current?.contentWindow?.postMessage(
        '{"event":"command","func":"unMute","args":""}',
        "*",
      );
      updateProgressBar(volumeRef, `${get().volume.value * 100}`);
      set((state) => ({
        volume: { ...state.volume, muted: false },
      }));
    }
  },
  handleVolume: (chillRef, volume) => {
    if (chillRef.current) {
      chillRef.current.contentWindow?.postMessage(
        `{"event":"command","func":"setVolume","args":["${volume}"]}`,
        "*",
      );
    }
  },
}));

export { useChillStore };
