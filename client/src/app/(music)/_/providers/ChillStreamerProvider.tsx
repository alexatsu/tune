"use client";

import { createContext, useContext, useRef } from "react";

type ChillStreamerProps = {
  chillRef: React.RefObject<HTMLIFrameElement>;
  currentStreamRef: React.MutableRefObject<Stream | null>;
};

type Stream = {
  id: string;
  title: string;
  url: string;
  cover: string;
};

const ChillStreamerContext = createContext<ChillStreamerProps | null>(null);

function useChillStreamerContext() {
  const context = useContext(ChillStreamerContext);

  if (!context) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }

  return context;
}

function ChillStreamerProvider({ children }: { children: React.ReactNode }) {
  const chillRef = useRef<HTMLIFrameElement>(null);
  const currentStreamRef = useRef<Stream | null>(null);
  const values: ChillStreamerProps = {
    chillRef,
    currentStreamRef,
  };

  return <ChillStreamerContext.Provider value={values}>{children}</ChillStreamerContext.Provider>;
}

export { ChillStreamerProvider, useChillStreamerContext };
