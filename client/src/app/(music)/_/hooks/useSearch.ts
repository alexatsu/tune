import useSWR from "swr";
import { SongsResponse } from "../types";
import { useState } from "react";
import { useSession } from "next-auth/react";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [startSearch, setStartSearch] = useState(false);
  const session = useSession();

  const fetchAllMusic = async () => {
    const response = await fetch(`http://localhost:3000/api/songs/search?query=${query}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.data?.user?.email }),
    });

    return response.json();
  };

  const {
    data,
    error,
    isLoading,
    mutate: searchMutate,
  } = useSWR<SongsResponse>(
    startSearch ? `http://localhost:3000/api/songs/search?query=${query}` : null,
    fetchAllMusic,
    { revalidateOnFocus: false }
  );

  return {
    setQuery,
    setStartSearch,
    data,
    error,
    isLoading,
    searchMutate,
  };
}
