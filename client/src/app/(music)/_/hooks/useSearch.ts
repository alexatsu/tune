import useSWR from "swr";
import { SongsResponse } from "../types";
import { handleFetch } from "@/shared/utils/functions";
import { useState } from "react";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [startSearch, setStartSearch] = useState(false);
  const {
    data,
    error,
    isLoading,
    mutate: searchMutate,
  } = useSWR<SongsResponse>(
    startSearch ? `http://localhost:8000/search?query=${query}` : null,
    handleFetch,
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
