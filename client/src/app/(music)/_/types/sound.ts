import { ChangeEvent, RefObject } from "react";

export type PlayerSoundProps = {
  volume: { value: number; muted: boolean };
  handleMute: () => void;
  handleVolumeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  volumeRef: RefObject<HTMLInputElement>;
};
