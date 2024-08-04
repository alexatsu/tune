import { create } from "zustand";

import { SongsResponse } from "../types";

type SearchStore = {
  input: string;
  setInput: (input: string) => void;
  musicList: SongsResponse;
  setMusicList: (musicList: SearchStore["musicList"]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: Error | null;
  setError: (error: Error | null) => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  input: "",
  setInput: (input: string) => set({ input }),
  musicList: {
    songs: [],
    message: "",
    type: "",
  },
  setMusicList: (musicList: SearchStore["musicList"]) => set({ musicList }),
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  error: null,
  setError: (error: Error | null) => set({ error }),
}));
