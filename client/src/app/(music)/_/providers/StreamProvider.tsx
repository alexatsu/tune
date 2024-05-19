"use client";

import { createContext, useContext, useRef } from "react";

type StreamProvider = {
  streamRef: React.RefObject<HTMLIFrameElement>;
  currentStreamRef: React.MutableRefObject<Stream | null>;
  volumeRef: React.RefObject<HTMLInputElement>;
};

type Stream = {
  urlId: string;
  title: string;
  url: string;
  cover: string;
};

const StreamContext = createContext<StreamProvider | null>(null);

function useStreamContext() {
  const context = useContext(StreamContext);

  if (!context) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }

  return context;
}

function StreamProvider({ children }: { children: React.ReactNode }) {
  const streamRef = useRef<HTMLIFrameElement>(null);
  const currentStreamRef = useRef<Stream | null>(null);
  const volumeRef = useRef<HTMLInputElement>(null);

  const values: StreamProvider = {
    streamRef,
    currentStreamRef,
    volumeRef,
  };

  return <StreamContext.Provider value={values}>{children}</StreamContext.Provider>;
}

export { StreamProvider, useStreamContext };
