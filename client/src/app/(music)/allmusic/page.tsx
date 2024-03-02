"use client";

import { useSession } from "next-auth/react";

// import { MusicList } from "@/music/_/components";
import { useSongs } from "@/music/_/hooks";
import dynamic from "next/dynamic";

const MusicList = dynamic(() =>
  import("@/music/_/components").then((mod) => {
    return mod.MusicList;
  })
);
export default function Page() {
  const { data: session } = useSession();
  const { songs, isLoading,data } = useSongs(session);

  if (isLoading) return <div>Loading...</div>;
  if (!songs) return <div>could not get any songs</div>;

  return <MusicList data={data || undefined} session={session} />;
}
