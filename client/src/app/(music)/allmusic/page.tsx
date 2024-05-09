"use client";

// import { MusicList } from "@/music/_/components";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import { useSongs } from "@/music/_/hooks";

const MusicList = dynamic(() => import("@/music/_/components").then((mod) => mod.MusicList));

import Link from "next/link";

import { Skeleton } from "../_/components/Skeleton";
import styles from "./styles.module.scss";

export default function Page() {
  const { data: session } = useSession();
  const { songs, isLoading, data } = useSongs(session);

  if (!session) redirect("/signin");

  const payload = { songs: songs || [], message: "success" };

  const musicList = isLoading ? (
    <div className={styles.musicListSkeletonContainer}>
      <Skeleton className={styles.musicListSkeleton} />
    </div>
  ) : (
    <div className={styles.allMusicListContainer}>
      <MusicList data={payload} session={session} />
    </div>
  );

  return songs && songs.length < 1 ? (
    <div className={styles.errorMessageContainer}>
      <p>No songs were added, look for them in</p> <Link href={"/search"}>Search</Link>
    </div>
  ) : (
    musicList
  );
}
