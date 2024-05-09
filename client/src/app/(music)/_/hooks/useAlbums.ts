import { useSession } from "next-auth/react";
import useSWR from "swr";

import { AlbumsResponse } from "../types";

export function useAlbums(id = "") {
  console.log(id, " here is the id in useAlbums hook");
  const { data: session } = useSession();
  const url = `/api/albums/get-all`;

  const fetchAllAlbums = async () => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session }),
    });

    return response.json();
  };

  const swrOptions = {
    revalidateOnFocus: false,
  };

  const {
    data: albums,
    error: albumsError,
    isLoading: albumsIsLoading,
    mutate: albumsMutate,
  } = useSWR<AlbumsResponse>(url, fetchAllAlbums, swrOptions);

  return {
    albums,
    albumsError,
    albumsIsLoading,
    albumsMutate,
  };
}
