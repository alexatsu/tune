import { create } from "zustand";

type HeaderDropdownStore = {
  isHeaderDropdownOpen: boolean;
  setIsHeaderDropdownOpen: (value: boolean) => void;
};

export const useHeaderDropdownStore = create<HeaderDropdownStore>((set) => ({
  isHeaderDropdownOpen: false,
  setIsHeaderDropdownOpen: (value) => set({ isHeaderDropdownOpen: value }),
}));
