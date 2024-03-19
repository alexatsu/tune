"use client";

// import { MusicList } from "@/music/_/components";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import { useSongs } from "@/music/_/hooks";

const MusicList = dynamic(() => import("@/music/_/components").then((mod) => mod.MusicList));

import Link from "next/link";

import styles from "./styles.module.scss";

export default function Page() {
  const { data: session } = useSession();
  const { songs, isLoading, data } = useSongs(session);

  if (!session) redirect("/signin");

  if (isLoading) return <div>Loading...</div>;
  if (!songs) return <div>could not get any songs</div>;

  return songs.length < 1 ? (
    <div className={styles.errorMessageContainer}>
      <p>No songs were added, look for them in</p> <Link href={"/search"}>Search</Link>
    </div>
  ) : (
    <MusicList data={data || undefined} session={session} />
  );
}
