import { useChillStreamerContext } from "@/music/_/providers";
import { useChillStore } from "@/shared/store";

import styles from "./styles.module.scss";

export function ChillStreamer() {
  const { currentId } = useChillStore();
  const { chillRef } = useChillStreamerContext();
  return (
    <>
      <iframe
        src={`https://www.youtube.com/embed/${currentId}?enablejsapi=1&html5=1`}
        ref={chillRef}
        allow="autoplay; encrypted-media"
        title="video"
        allowFullScreen
        style={{ display: "none" }}
      />
      <span style={{ color: "white" }}> ChillStreamer</span>
    </>
  );
}
