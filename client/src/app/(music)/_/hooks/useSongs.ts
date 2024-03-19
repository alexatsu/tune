import { Session } from "next-auth";
import useSWR from "swr";

import { SongsResponse } from "@/music/_/types";
import { urls } from "@/shared/utils/consts";

const { client } = urls;

function useSongs(session: Session | null) {
  const fetchAllMusic = async () => {
    const response = await fetch(`${client}/api/songs/get-all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session }),
    });

    return response.json();
  };

  const { data, error, isLoading, mutate } = useSWR<SongsResponse>(
    `${client}/api/songs/get-all`,
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
