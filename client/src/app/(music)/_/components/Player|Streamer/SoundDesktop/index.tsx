import { ChangeEvent, RefObject } from "react";

import { Muted } from "../../icons/player/Muted";
import { Unmuted } from "../../icons/player/Unmuted";
import styles from "./styles.module.scss";

type SoundDesktopProps = {
  volume: { value: number; muted: boolean };
  handleMute: () => void;
  handleVolumeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  volumeRef: RefObject<HTMLInputElement>;
};

export function SoundDesktop({
  volume,
  handleMute,
  handleVolumeChange,
  volumeRef,
}: SoundDesktopProps) {
  return (
    <div className={styles.soundDesktop}>
      {volume.muted && <Muted style={{ cursor: "pointer" }} onClick={handleMute} />}
      {!volume.muted && <Unmuted style={{ cursor: "pointer" }} onClick={handleMute} />}

      <input
        className={styles.volume}
        ref={volumeRef}
        type="range"
        value={volume.muted ? 0 : volume.value * 100}
        onChange={handleVolumeChange}
      />
    </div>
  );
}
