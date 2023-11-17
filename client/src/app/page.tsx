import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Link from "next/link";

import btn from "../shared/sass/components/Button.module.scss";
import page from "./_root/sass/Page.module.scss";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  // const session = await getServerSession();

  // if (session) {
  //   redirect("/music");
  // }
  //player example
  // const [theme, setTheme] = useState("dark");
  // useEffect(() => {
  //   const video = document.getElementById("video") as HTMLVideoElement;
  //   const hls = new Hls();
  //   hls.loadSource("http://localhost:8000/audio/NF - The Search/index.m3u8");
  //   hls.attachMedia(video);
  // }, []);
  //themes example
  // const variableRef = useRef<string>();
  // useEffect(() => {
  //   variableRef.current = window
  //     .getComputedStyle(document.documentElement)
  //     .getPropertyValue("--bg");
  // }, []);

  return (
    <main className={page.main}>
      <article className={page.article}>
        <p>
          Welcome to <span>Tune</span>, a place dedicated to bringing you the best in music. Bring
          your music, own{" "}
          <u style={{ textDecorationColor: "var(--accent)", textUnderlineOffset: "3px" }}>
            forever
          </u>
          .
        </p>

        <p>
          Here to help you discover new sounds and connect with your favorite artists. Join today
          and start your music journey!
        </p>
      </article>

      <section className={page.find}>
        <div>
          <h3>Find your music</h3>
          <h2>&</h2>
          <h1>Tune</h1>
        </div>

        <Link href={"/signin"}>
          <button className={btn.connect}>Connect</button>
        </Link>
      </section>

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
