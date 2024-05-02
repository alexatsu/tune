"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import { AlbumIdResponse } from "@/music/_/types";

import { MusicList } from "../../_/components";
import styles from "./styles.module.scss";

export default function Page({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const { id } = params;

  if (!session) redirect("/signin");

  const fetchAlbum = async () => {
    const response = await fetch(`/api/albums/get-by-id`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session, id }),
    });

    return response.json();
  };

  const { data, isLoading, error } = useSWR<AlbumIdResponse>(`/api/albums/get-by-id`, fetchAlbum, {
    revalidateOnFocus: false,
  });

  console.log(data, " here is the data from the album[id]");
  const album = data?.album;

  const musicList = {
    songs: album?.songs || [],
    message: `success, albumId is ${id}`,
  };
  console.log(musicList, " here is the music list");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className={styles.AlbumHead}>
        <div className={styles.Cover} style={{ background: album?.gradient }}></div>
        <div className={styles.Content}>
          <h1 className={styles.Title}>{album?.title}</h1>
          <span className={styles.Description}>{album?.description}</span>
        </div>
      </div>

      <MusicList data={musicList} session={session} />
    </div>
  );
}
