"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";

import { playerIcons } from "@/app/(music)/_/components/icons/player";
import {
  ImageBlockDesktop,
  MainTrack,
  PlayerContainer,
  TitleDesktop,
} from "@/app/(music)/_/components/Player|Streamer";
import { useChillStreamerContext } from "@/app/(music)/_/providers";
import type { StreamResponse } from "@/app/(music)/chill/_/types";
import { useChillStore } from "@/shared/store";

import styles from "./styles.module.scss";

const { Pause, Play } = playerIcons;

export function ChillStreamer() {
  const {
    currentId,
    setCurrentId,
    isStreaming,
    handleLoad,
    handlePause,
    handlePlay,
    toggleMute,
    handleVolume,
  } = useChillStore();
  const { chillRef, currentStreamRef } = useChillStreamerContext();

  const fetchAllStreams = async () => {
    const response = await fetch(`/api/chill/stream`);

    return response.json();
  };

  const { data, error, isLoading, mutate } = useSWR<StreamResponse>(
    `/api/songs/get-all`,
    fetchAllStreams,
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    if (data && chillRef.current) {
      setCurrentId(data.streams[0].id);
      handleLoad(chillRef);
      currentStreamRef.current = {
        id: data.streams[0].id,
        url: `https://www.youtube.com/embed/${data.streams[0].id}?enablejsapi=1&html5=1`,
        cover: data.streams[0].cover,
        title: data.streams[0].title,
      };
    }
  }, [data, setCurrentId, chillRef, handleLoad, currentStreamRef]);

  return (
    <>
      <PlayerContainer className={styles.desktopChillStreamerContainer}>
        <ImageBlockDesktop isLoading={isLoading} currentPlayRef={currentStreamRef} />

        <MainTrack className={styles.mainTrackDesktop}>
          <div className={styles.buttonsDesktop}>
            {isStreaming && <Pause onClick={() => handlePause(chillRef)} />}
            {!isStreaming && <Play onClick={() => handlePlay(chillRef)} />}
          </div>

          <TitleDesktop isLoading={isLoading} currentPlayRef={currentStreamRef} />
        </MainTrack>
        <button onClick={() => toggleMute(chillRef)}>Mute</button>
        <button onClick={() => handleVolume(chillRef, 30)}>Set 30%</button>
        <button onClick={() => handleVolume(chillRef, 100)}>Set 100%</button>
      </PlayerContainer>

      <iframe
        src={`https://www.youtube.com/embed/${currentId}?enablejsapi=1&html5=1`}
        ref={chillRef}
        allow="autoplay; encrypted-media; fullscreen;"
        title="video"
        allowFullScreen
        style={{ display: "none" }}
      />
    </>
  );
}
