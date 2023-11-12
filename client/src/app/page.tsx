"use client";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import "@/shared/sass/main.scss";

export default function Page() {
  
  //player example
  // const [theme, setTheme] = useState("dark");
  // useEffect(() => {
  //   const video = document.getElementById("video") as HTMLVideoElement;
  //   const hls = new Hls();
  //   hls.loadSource("http://localhost:8000/audio/NF - The Search/index.m3u8");
  //   hls.attachMedia(video);
  // }, []);
  console.log(process.env.DATABASE_URL)
  //themes example
  // const variableRef = useRef<string>();
  // useEffect(() => {
  //   variableRef.current = window
  //     .getComputedStyle(document.documentElement)
  //     .getPropertyValue("--bg");
  // }, []);

  return (
    <main>
      {/* themes part */}
      {/* <section style={{ backgroundColor: "white", height: "100px" }}>
        <input
          onChange={() => {
            document.documentElement.style.setProperty("--bg", "white");
            setTheme("light");
          }}
          type="radio"
          id="light"
          name="theme"
          value="light"
          checked={theme === "light"}
        />
        <input
          onChange={() => {
            document.documentElement.style.setProperty("--bg", "black");
            setTheme("dark");
          }}
          type="radio"
          id="dark"
          name="theme"
          value="dark"
          checked={theme === "dark"}
        />
      </section> */}
      {/* video part */}
      {/* <video controls width={320} height={240} id="video"></video> */}
    </main>
  );
}
