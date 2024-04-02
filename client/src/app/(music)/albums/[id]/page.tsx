"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import { AlbumResponse } from "@/music/_/types";

import styles from "./styles.module.scss";

export default function Page({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const { id } = params;

  if (!session) redirect("/signin");

  const fetchAlbum = async () => {
    const response = await fetch(`/api/albums/get-one`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session, id }),
    });

    return response.json();
  };

  const { data, isLoading, error } = useSWR<AlbumResponse>(`/api/albums/get-one`, fetchAlbum, {
    revalidateOnFocus: false,
  });

  const album = data?.album;

  return (
    <div>
      <div className={styles.AlbumHead}>
        <div className={styles.Cover} style={{ background: album?.gradient }}></div>
        <div className={styles.Content}>
          <h1 className={styles.Title}>{album?.title}</h1>
          <span className={styles.Description}>{album?.description}</span>
        </div>
      </div>
    </div>
  );
}
