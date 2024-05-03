"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import { Album, AlbumIdResponse } from "@/music/_/types";

import { MusicList } from "../../_/components";
import styles from "./styles.module.scss";

export default function Page({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const { id } = params;
  console.log(id, " here is the id");
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
  const musicList = { songs: data?.album?.albumSongs || [], message: `success, albumId is ${id}` };

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className={styles.AlbumHead}>
        <div className={styles.Cover} style={{ background: data?.album?.gradient }}></div>
        <div className={styles.Content}>
          <h1 className={styles.Title}>{data?.album?.title}</h1>
          <span className={styles.Description}>{data?.album?.description}</span>
        </div>
      </div>

      <MusicList data={musicList} session={session} />
    </div>
  );
}
