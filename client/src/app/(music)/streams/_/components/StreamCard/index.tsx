"use client";

import Image from "next/image";

import { usePlayerContext } from "@/app/_/providers";
import { Stream, StreamResponse } from "@/music/_/types";
import { useStreamStore } from "@/shared/store";

import styles from "./styles.module.scss";

export function StreamCard({ stream, data }: { stream: Stream; data: StreamResponse }) {
  const { currentId, setCurrentId, isStreaming, setIsStreaming, handlePause, volume } =
    useStreamStore();
  const { currentSongOrStreamRef, playerRef, currentPayload } = usePlayerContext();

  const handleStreamById = (stream: Stream, volume: number) => {
    console.log(stream, " here is the stream");

    if (!currentPayload.current || currentPayload.current.type !== data.type) {
      currentPayload.current = {
        songsOrStreams: data.streams,
        type: data.type,
      };
    }

    const { urlId } = stream;
    if (playerRef.current) {
      playerRef.current.src = `https://www.youtube.com/embed/${urlId}?enablejsapi=1&html5=1`;
      currentSongOrStreamRef.current = stream;

      setTimeout(() => {
        playerRef.current?.contentWindow?.postMessage(
          `{"event":"command","func":"setVolume","args":["${volume}"]}`,
          "*",
        );
        playerRef.current?.contentWindow?.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          "*",
        );
      }, 1000);
    }
    setCurrentId(urlId);
    setIsStreaming(true);
  };

  const togglePlay = () => {
    console.log(stream.urlId, " here is the url id");
    if (isStreaming && currentId === stream.urlId) {
      handlePause(playerRef);
    } else {
      handleStreamById(stream, volume.value * 100);
    }
  };

  const getCardClassName = () => {
    if (!isStreaming) {
      return styles.streamCardContainerNoStream;
    }

    if (isStreaming && currentId === stream.urlId) {
      return styles.streamCardContainer;
    }

    return styles.streamCardContainerNotPlaying;
  };

  return (
    <div className={getCardClassName()} onClick={togglePlay}>
      <div className={styles.titleBlock}>
        <span className={styles.title}>{stream.title}</span>
      </div>

      <Image
        src={stream.cover}
        alt="cover"
        width="250"
        height="200"
        className={styles.streamImage}
      />
    </div>
  );
}
