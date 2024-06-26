import type { PlayerSoundProps } from "@/app/(music)/_/types";

import styles from "./styles.module.scss";

type PlayerSoundMobileProps = Omit<PlayerSoundProps, "handleMute"> & {
  setSoundMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function SoundMobile({
  // volume,
  handleVolumeChange,
  volumeRef,
  setSoundMobileOpen,
}: PlayerSoundMobileProps) {
  return (
    <div className={styles.soundMobileContainer}>
      <input
        className={styles.volumeMobileTrack}
        ref={volumeRef}
        type="range"
        // value={volume.muted ? 0 : volume.value * 100}
        onChange={handleVolumeChange}
      />
      <svg
        onClick={() => setSoundMobileOpen(false)}
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 512 512"
        height="20px"
        width="20px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"></path>
      </svg>
    </div>
  );
}
