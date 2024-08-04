import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession, Session } from "next-auth";

import { authOptions } from "@/app/_/utils/functions";

import styles from "./page.module.scss";

export default async function Page() {
  const session = (await getServerSession(authOptions)) as Session;
  if (session) {
    redirect("/allmusic");
  }

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
    </main>
  );
}
