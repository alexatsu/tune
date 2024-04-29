"use client";

import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React from "react";
import useSWR from "swr";

import { AlbumCard, AlbumModal } from "@/music/albums/_/components";
import type { AlbumsResponse } from "@/music/_/types";

import styles from "./styles.module.scss";

export function AlbumList() {
  const { data: session } = useSession();

  if (!session) redirect("/signin");

  const fetchAllAlbums = async () => {
    const response = await fetch(`/api/albums/get-all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session }),
    });

    return response.json();
  };

  const { data, isLoading, error, mutate } = useSWR<AlbumsResponse>(
    `/api/albums/get-all`,
    fetchAllAlbums,
    {
      revalidateOnFocus: false,
    },
  );

  const albums = data?.albums;

  const { push } = useRouter();

  return (
    <div className={styles.AlbumList}>
      <AlbumModal session={session} />
      {albums?.map(({ id, gradient, title, description }) => (
        <AlbumCard
          key={id}
          gradient={gradient}
          title={title}
          description={description}
          onClick={() => push(`albums/${id}`)}
        />
      ))}
    </div>
  );
}
