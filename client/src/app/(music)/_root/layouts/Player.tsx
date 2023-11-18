"use client";
import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import sass from "../sass/layouts/Player.module.scss";

export function Player() {
  const [play, setPlay] = useState(false);
  const video = document.getElementById("video") as HTMLVideoElement;
  const playerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const hls = new Hls();

    hls.on(Hls.Events.MEDIA_ATTACHED, function () {
      console.log("video and hls.js are now bound together !");
    });

    hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
      console.log("manifest loaded, found " + data.levels.length + " quality level");
    });

    hls.loadSource("/music/NF - The Search/index.m3u8");
    if (playerRef.current) {
      hls.attachMedia(playerRef.current);
    }
  }, [video]);

  const handlePlay = () => {
    playerRef.current?.play();
  };

  return (
    <div className={sass.playerContainer}>
      <div>
        <button onClick={handlePlay}>try</button>
        <div>Manipulations</div>
        <video ref={playerRef} controls width={320} height={240} id="video"></video>
      </div>
    </div>
  );
}
