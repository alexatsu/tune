"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { LoadContainer } from "../layouts/LoadContainer";

type LoadContextProps = {
  mounted: boolean;
  setMounted: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoadContext = createContext<LoadContextProps | null>(null);

function useLoadContext() {
  const context = useContext(LoadContext);

  if (!context) {
    throw new Error("useLoadContext must be used within a LoadProvider");
  }

  return context;
}

function LoadProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const values: LoadContextProps = {
    mounted,
    setMounted,
  };

  if (!mounted) {
    return <LoadContainer />;
  }

  return <LoadContext.Provider value={values}>{children}</LoadContext.Provider>;
}

export { LoadProvider, useLoadContext };
