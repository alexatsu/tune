"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import { SongsResponse } from "@/music/_/types";

import styles from "./styles.module.scss";

export function AlbumList() {
  const { data: session } = useSession();
  function getRandomColorInRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateRandomTwoColorGradient() {
    let color1 = () => getRandomColorInRange(0, 124);
    let color2 = () => getRandomColorInRange(125, 255);

    return [
      `rgba(${color1()}, ${color1()}, ${color1()},0.8)`,
      `rgba(${color2()}, ${color2()}, ${color2()},0.8)`,
    ];
  }

  if (!session) redirect("/signin");

  const fetchAllAlbums = async () => {
    const response = await fetch(`/api/albums/get-all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session }),
    });

    return response.json();
  };

  const { data, error, isLoading } = useSWR<SongsResponse>(`/api/albums/get-all`, fetchAllAlbums, {
    revalidateOnFocus: false,
  });

  return (
    <div className={styles.AlbumList}>
      <div
        className={styles.Album}
        style={{
          background: `linear-gradient(125deg, ${generateRandomTwoColorGradient()[1]} 30%, ${generateRandomTwoColorGradient()[0]} 70%)`,
        }}
      >
        <div className={styles.content}>
          <h4 className={styles.title}>Title</h4>
          <span className={styles.description}>Some description</span>
        </div>
      </div>
      <div
        className={styles.Album}
        style={{
          background: `linear-gradient(125deg, ${generateRandomTwoColorGradient()[1]} 30%, ${generateRandomTwoColorGradient()[0]} 70%)`,
        }}
      >
        <div className={styles.content}>
          <h4 className={styles.title}>Title</h4>
          <span className={styles.description}>Some description</span>
        </div>
      </div>
      <div
        className={styles.Album}
        style={{
          background: `linear-gradient(125deg, ${generateRandomTwoColorGradient()[1]} 30%, ${generateRandomTwoColorGradient()[0]} 70%)`,
        }}
      >
        <div className={styles.content}>
          <h4 className={styles.title}>Title</h4>
          <span className={styles.description}>Some description</span>
        </div>
      </div>
      <div
        className={styles.Album}
        style={{
          background: `linear-gradient(125deg, ${generateRandomTwoColorGradient()[1]} 30%, ${generateRandomTwoColorGradient()[0]} 70%)`,
        }}
      >
        <div className={styles.content}>
          <h4 className={styles.title}>Title</h4>
          <span className={styles.description}>Some description</span>
        </div>
      </div>
    </div>
  );
}
