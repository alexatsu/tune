"use client";

import { useSession } from "next-auth/react";

// import { MusicList } from "@/music/_/components";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { useSongs } from "@/music/_/hooks";

const MusicList = dynamic(() => import("@/music/_/components").then((mod) => mod.MusicList));

export default function Page() {
  const { data: session } = useSession();
  const { songs, isLoading, data } = useSongs(session);

  if (!session) redirect("/signin");

  if (isLoading) return <div>Loading...</div>;
  if (!songs) return <div>could not get any songs</div>;

  return <MusicList data={data || undefined} session={session} />;
}
