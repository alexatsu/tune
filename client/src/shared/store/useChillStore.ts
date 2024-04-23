import { RefObject } from "react";
import { create } from "zustand";

type ChillStore = {
  currentId: string;
  setCurrentId: (value: string) => void;

  isStreaming: boolean;
  setIsStreaming: (value: boolean) => void;
  handleLoad: (chillRef: RefObject<HTMLIFrameElement>) => void;
  handlePlay: (chillRef: RefObject<HTMLIFrameElement>) => void;
  handlePause: (chillRef: RefObject<HTMLIFrameElement>) => void;
  muted: boolean;
  toggleMute: (chillRef: RefObject<HTMLIFrameElement>) => void;
  handleVolume: (chillRef: RefObject<HTMLIFrameElement>, value: number) => void;
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
  handlePlay: (chillRef) => {
    if (chillRef.current) {
      chillRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
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
  muted: false,
  toggleMute: (chilRef) => {
    if (chilRef.current && !get().muted) {
      chilRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"mute","args":""}',
        "*",
      );
      set({ muted: true });
    } else {
      chilRef.current?.contentWindow?.postMessage(
        '{"event":"command","func":"unMute","args":""}',
        "*",
      );
      set({ muted: false });
    }
  },
  handleVolume: (chillRef, value) => {
    if (chillRef.current) {
      chillRef.current.contentWindow?.postMessage(
        `{"event":"command","func":"setVolume","args":["${value}"]}`,
        "*",
      );
    }
  },
}));

export { useChillStore };
