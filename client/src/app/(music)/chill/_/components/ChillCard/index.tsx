"use client";

import Image from "next/image";
import { useState } from "react";

import { playerIcons } from "@/app/(music)/_/components/icons/player";
import { useChillStreamerContext } from "@/app/(music)/_/providers";
import { useChillStore } from "@/shared/store";
import { ChillStreams } from "@/shared/utils/types";

import styles from "./styles.module.scss";

const { Play, Pause } = playerIcons;

export function ChillCard({ title, id, cover, url }: ChillStreams) {
  const { chillRef } = useChillStreamerContext();
  const { currentId, setCurrentId } = useChillStore();
  const [isStreaming, setIsStreaming] = useState(false);

  const handlePlay = (newId: string) => {
    setIsStreaming(true);
    setCurrentId(newId);

    if (chillRef.current) {
      chillRef.current.src = `https://www.youtube.com/embed/${newId}?enablejsapi=1&html5=1`;

      setTimeout(() => {
        chillRef.current?.contentWindow?.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          "*",
        );
      }, 1000);
    }
  };

  const handlePause = () => {
    if (chillRef.current) {
      chillRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*",
      );
      setIsStreaming(false);
    }
  };

  return (
    <>
      <div className={styles.chillCardContainer}>
        <div className={styles.titleBlock}>
          <div className={styles.streamButtons}>
            {isStreaming && currentId === id ? (
              <Pause onClick={handlePause} />
            ) : (
              <Play onClick={() => handlePlay(id)} />
            )}
          </div>
          <span className={styles.title}>{title}</span>
        </div>

        <Image src={cover} alt="cover" width="250" height="200" className={styles.chillImage} />
      </div>
    </>
  );
}
