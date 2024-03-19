import { Session } from "next-auth";
import useSWR from "swr";

import { SongsResponse } from "@/music/_/types";

function useSongs(session: Session | null) {
  const fetchAllMusic = async () => {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/songs/get-all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session }),
    });

    return response.json();
  };

  const { data, error, isLoading, mutate } = useSWR<SongsResponse>(
    `${process.env.NEXTAUTH_URL}/api/songs/get-all`,
    fetchAllMusic,
    { revalidateOnFocus: false },
  );

  const songs = data?.songs;

  return {
    error,
    isLoading,
    songs,
    mutate,
    data,
  };
}

export { useSongs };
