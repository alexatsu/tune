"use client";

import Image from "next/image";

import { usePlayerContext } from "@/app/_/providers";
import { useStreamStore } from "@/app/_/store";
import { Stream, StreamResponse } from "@/music/_/types";

import styles from "./styles.module.scss";

export function StreamCard({ stream, data }: { stream: Stream; data: StreamResponse }) {
  const {
    currentId,
    setCurrentId,
    isStreaming,
    setIsStreaming,
    handlePause,
    volume,
    setIsStartingPlaying,
  } = useStreamStore();
  const { currentSongOrStreamRef, playerRef, currentPayload, playerUrl } = usePlayerContext();

  const handleStreamById = (stream: Stream, volume: number) => {
    if (!currentPayload.current || currentPayload.current.type !== data.type) {
      currentPayload.current = {
        songsOrStreams: data.streams,
        type: data.type,
      };
    }

    const { urlId, url } = stream;
    if (playerRef.current) {
      setIsStartingPlaying(true);
      playerUrl.current = url;
      currentSongOrStreamRef.current = stream;
    }
    setCurrentId(urlId);
    setIsStreaming(true);
  };

  const togglePlay = () => {
    if (isStreaming && currentId === stream.urlId) {
      handlePause();
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
