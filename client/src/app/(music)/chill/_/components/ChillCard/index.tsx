"use client";

import Image from "next/image";

import { playerIcons } from "@/app/(music)/_/components/icons/player";
import { useChillStreamerContext } from "@/app/(music)/_/providers";
import { useChillStore } from "@/shared/store";
import { ChillStreams } from "@/shared/utils/types";

import styles from "./styles.module.scss";

const { Play, Pause } = playerIcons;

export function ChillCard({ title, id, cover, url }: ChillStreams) {
  const { chillRef, currentStreamRef } = useChillStreamerContext();
  const { currentId, setCurrentId, isStreaming, setIsStreaming, handlePause } = useChillStore();

  const handlePlayById = (newId: string) => {
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
          `{"event":"command","func":"setVolume","args":["30"]}`,
          "*",
        );
        chillRef.current?.contentWindow?.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          "*",
        );
      }, 1000);
    }
  };

  return (
    <>
      <div className={styles.chillCardContainer}>
        <div className={styles.titleBlock}>
          <div className={styles.streamButtons}>
            {isStreaming && currentId === id ? (
              <Pause onClick={() => handlePause(chillRef)} />
            ) : (
              <Play onClick={() => handlePlayById(id)} />
            )}
          </div>
          <span className={styles.title}>{title}</span>
        </div>

        <Image src={cover} alt="cover" width="250" height="200" className={styles.chillImage} />
      </div>
    </>
  );
}
