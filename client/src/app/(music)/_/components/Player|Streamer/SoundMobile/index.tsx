import type { PlayerSoundProps } from "@/app/(music)/_/types";

import { playerIcons } from "../../icons/player";
import styles from "./styles.module.scss";

type PlayerSoundMobileProps = Omit<PlayerSoundProps, "handleMute"> & {
  setSoundMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function SoundMobile({
  volume,
  handleVolumeChange,
  volumeRef,
  setSoundMobileOpen,
}: PlayerSoundMobileProps) {
  const { Back } = playerIcons;

  return (
    <div className={styles.soundMobileContainer}>
      <input
        className={styles.volumeMobileTrack}
        ref={volumeRef}
        type="range"
        value={volume.muted ? 0 : volume.value * 100}
        onChange={handleVolumeChange}
      />
      <Back onClick={() => setSoundMobileOpen(false)} />
    </div>
  );
}
