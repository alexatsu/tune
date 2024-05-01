"use client";

import Image from "next/image";

import { useChillStreamerContext } from "@/app/(music)/_/providers";
import { useChillStore } from "@/shared/store";
import { ChillStreams } from "@/shared/utils/types";

import styles from "./styles.module.scss";

export function ChillCard({ title, id, cover, url }: ChillStreams) {
  const { chillRef, currentStreamRef, volumeRef } = useChillStreamerContext();
  const { currentId, setCurrentId, isStreaming, setIsStreaming, handlePause, volume, setVolume } =
    useChillStore();

  const handleStreamById = (newId: string, volume: number) => {
    setIsStreaming(true);
    setCurrentId(newId);

    if (chillRef.current) {
      chillRef.current.src = `https://www.youtube.com/embed/${newId}?enablejsapi=1&html5=1`;
      currentStreamRef.current = {
        id: newId,
        url: `https://www.youtube.com/embed/${newId}?enablejsapi=1&html5=1`,
        cover: cover,
        title: title,
      };
      setTimeout(() => {
        chillRef.current?.contentWindow?.postMessage(
          `{"event":"command","func":"setVolume","args":["${volume}"]}`,
          "*",
        );
        chillRef.current?.contentWindow?.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          "*",
        );
      }, 1000);

      setVolume(volumeRef, volume / 100);
    }
  };

  const togglePlay = () => {
    if (isStreaming && currentId === id) {
      handlePause(chillRef);
    } else {
      handleStreamById(id, volume.value * 100);
    }
  };

  const getCardClassName = () => {
    if (!isStreaming) {
      return styles.chillCardContainerNoStream;
    }

    if (isStreaming && currentId === id) {
      return styles.chillCardContainer;
    }

    return styles.chillCardContainerNotPlaying;
  };

  return (
    <div className={getCardClassName()} onClick={togglePlay}>
      <div className={styles.titleBlock}>
        <span className={styles.title}>{title}</span>
      </div>

      <Image src={cover} alt="cover" width="250" height="200" className={styles.chillImage} />
    </div>
  );
}
