"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import { PageTitle, Skeleton } from "@/music/_/components";
import { useSongs } from "@/music/_/hooks";
import { attachUUIDToSongs } from "@/music/_/utils/functions";

import PageContainer from "../_/layouts/PageContainer";
import styles from "./styles.module.scss";

const MusicList = dynamic(() => import("@/music/_/components").then((mod) => mod.MusicList));

export default function Page() {
  const { data: session } = useSession();
  const { songs, isLoading, data } = useSongs(session);
  if (!session) redirect("/signin");

  const songsWithUUID = attachUUIDToSongs(songs || []);

  const payload = { songs: songsWithUUID || [], message: "success", type: "allmusic" };

  const musicList = isLoading ? (
    <div className={styles.musicListSkeletonContainer}>
      <Skeleton className={styles.musicListSkeleton} />
    </div>
  ) : (
    <MusicList data={payload} session={session} />
  );

  return songs && songs.length < 1 ? (
    <div className={styles.errorMessageContainer}>
      <p>No songs were added, look for them in</p> <Link href={"/search"}>Search</Link>
    </div>
  ) : (
    <PageContainer>
      <PageTitle title={"Music"} />
      {musicList}
    </PageContainer>
  );
}
