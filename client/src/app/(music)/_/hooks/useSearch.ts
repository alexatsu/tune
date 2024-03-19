import { useSession } from "next-auth/react";
import { useState } from "react";
import useSWR from "swr";

import { urls } from "@/shared/utils/consts";

import { SongsResponse } from "../types";

const { client } = urls;

export function useSearch() {
  const [query, setQuery] = useState("");
  const [startSearch, setStartSearch] = useState(false);
  const session = useSession();
  const url = `${client}/api/songs/search?query=${query}`;

  const fetchAllMusic = async () => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session }),
    });

    return response.json();
  };

  const {
    data,
    error,
    isLoading,
    mutate: searchMutate,
  } = useSWR<SongsResponse>(startSearch ? url : null, fetchAllMusic, { revalidateOnFocus: false });

  return {
    setQuery,
    setStartSearch,
    data,
    error,
    isLoading,
    searchMutate,
  };
}
