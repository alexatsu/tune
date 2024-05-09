"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { playerIcons } from "@/music/_/components/icons/player";
import {
  ImageBlockDesktop,
  MainTrack,
  PlayerContainer,
  SoundDesktop,
  SoundMobile,
  TitleDesktop,
} from "@/music/_/components/Player|Streamer";
import { useMobile } from "@/music/_/hooks";
import { useChillStreamerContext } from "@/music/_/providers";
import { updateProgressBar } from "@/music/_/utils/functions";
import type { StreamResponse } from "@/music/chill/_/types";
import { useChillStore } from "@/shared/store";

import styles from "./styles.module.scss";

const { Pause, Play, Unmuted: SoundIcon } = playerIcons;

export function ChillStreamer() {
  const {
    currentId,
    isStreaming,
    setIsStreaming,
    handlePause,
    handlePlay,
    volume,
    setVolume,
    handleVolume,
    toggleMute,
  } = useChillStore();
  const { chillRef, currentStreamRef, volumeRef } = useChillStreamerContext();
  const isMobile = useMobile(576);
  const [soundMobileOpen, setSoundMobileOpen] = useState(false);
  const url = `/api/chill/stream`;

  const fetchAllStreams = async () => {
    const response = await fetch(url);

    return response.json();
  };

  const { data, error, isLoading } = useSWR<StreamResponse>(url, fetchAllStreams, {
    revalidateOnFocus: false,
  });

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    updateProgressBar(volumeRef, `${value}`);

    if (chillRef.current) {
      handleVolume(chillRef, +value);
      setVolume(volumeRef, +value / 100);
    }
  };

  useEffect(() => {
    const initialVolume = 0.3;
    const initialVolumePercentage = initialVolume * 100;
    if (data && volumeRef.current) {
      setVolume(volumeRef, initialVolume);
      updateProgressBar(volumeRef, `${initialVolumePercentage}`);
    }

    return () => setIsStreaming(false);
  }, [volumeRef, setVolume, data, setIsStreaming]);

  useEffect(() => {
    if ((isMobile && soundMobileOpen) || !isMobile) {
      updateProgressBar(volumeRef, `${volume.value * 100}`);
    }
  }, [isMobile, volumeRef, volume.value, soundMobileOpen]);

  return (
    <>
      {!isMobile ? (
        <PlayerContainer className={styles.desktopChillStreamerContainer}>
          <ImageBlockDesktop isLoading={isLoading} currentPlayRef={currentStreamRef} />

          <MainTrack className={styles.mainTrackDesktop}>
            <div className={styles.buttonsDesktop}>
              {isStreaming && <Pause onClick={() => handlePause(chillRef)} />}
              {!isStreaming && <Play onClick={() => handlePlay(chillRef, volume.value * 100)} />}
            </div>

            <TitleDesktop isLoading={isLoading} currentPlayRef={currentStreamRef} />
          </MainTrack>
          <SoundDesktop
            volume={volume}
            volumeRef={volumeRef}
            handleMute={() => toggleMute(chillRef, volumeRef)}
            handleVolumeChange={handleVolumeChange}
          />
        </PlayerContainer>
      ) : (
        <PlayerContainer className={styles.mobileChillStreamerContainer}>
          {soundMobileOpen ? (
            <SoundMobile
              volume={volume}
              handleVolumeChange={handleVolumeChange}
              volumeRef={volumeRef}
              setSoundMobileOpen={setSoundMobileOpen}
            />
          ) : (
            <MainTrack className={styles.mainTrackMobile}>
              <div className={styles.imageBlockMobile}>
                {currentStreamRef.current && (
                  <Image
                    src={currentStreamRef.current?.cover || ""}
                    alt="cover"
                    width={35}
                    height={35}
                    unoptimized
                  />
                )}

                {isStreaming && <Pause onClick={() => handlePause(chillRef)} />}
                {!isStreaming && <Play onClick={() => handlePlay(chillRef, volume.value * 100)} />}
              </div>

              <div className={styles.title}>{currentStreamRef.current?.title || ""}</div>
              <div className={styles.soundMobile}>
                <SoundIcon onClick={() => setSoundMobileOpen(true)} />
              </div>
            </MainTrack>
          )}
        </PlayerContainer>
      )}

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
