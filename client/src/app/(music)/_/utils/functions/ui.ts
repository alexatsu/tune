import { RefObject } from "react";

const updateProgressBar = (ref: RefObject<HTMLInputElement>, value: string) => {
  if (ref.current) {
    ref.current.style.background = `
    linear-gradient(to right, 
    var(--accent) ${value}%, 
    var(--white-fade) ${value}%)`;
  }
};

export { updateProgressBar };
