"use client";

import { createContext, useContext, useRef } from "react";

type ChillStreamerProps = {
  chillRef: React.RefObject<HTMLIFrameElement>;
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

  const values: ChillStreamerProps = {
    chillRef,
  };

  return <ChillStreamerContext.Provider value={values}>{children}</ChillStreamerContext.Provider>;
}

export { ChillStreamerProvider, useChillStreamerContext };
