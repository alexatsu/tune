"use client";

import { useSession } from "next-auth/react";

import { MusicList } from "@/music/_/components";
import { useSongs } from "@/music/_/hooks";

export default function Page() {
  const { data: session } = useSession();
  const { songs, isLoading } = useSongs(session);

  if (isLoading) return <div>Loading...</div>;
  if (!songs) return <div>could not get any songs</div>;

  return <MusicList songs={songs || undefined} session={session} />;
}
