import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import styles from "./page.module.scss";

import { Session, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Page() {
  const session = (await getServerSession(authOptions)) as Session;
  console.log(session, 'here is the session')
  // if (session) {
  //   redirect("/music");
  // }

  //themes example
  // const variableRef = useRef<string>();
  // useEffect(() => {
  //   variableRef.current = window
  //     .getComputedStyle(document.documentElement)
  //     .getPropertyValue("--bg");
  // }, []);
  console.log(process.env.DATABASE_URL, 'database url is here');

  return (
    <main className={styles.main}>
      <article className={styles.article}>
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

      <section className={styles.find}>
        <div>
          <h3>Find your music</h3>
          <h2>&</h2>
          <h1>Tune</h1>
        </div>

        {session ? (
          <Link href="/allmusic">
            <button className={styles.connected}>Connected, go to your music</button>
          </Link>
        ) : (
          <Link href={"/signin"}>
            <button className={styles.connect}>Connect</button>
          </Link>
        )}
      </section>

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
      {/* <video controls width={320} height={240} id="video"></video> */}
    </main>
  );
}
