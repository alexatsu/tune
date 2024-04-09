import { create } from "zustand";

type ChillStore = {
  currentId: string;
  setCurrentId: (value: string) => void;
};

const useChillStore = create<ChillStore>((set) => ({
  currentId: "",
  setCurrentId: (value) => set({ currentId: value }),
}));

export { useChillStore };
