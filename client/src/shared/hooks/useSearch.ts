import useSWR from "swr";
import { useState } from "react";

import { handleFetch } from "@/shared/utils/functions";

type Songs = {
  id: string;
  title: string;
  url: string;
  cover: string;
  duration: string;
};

type SongsData = {
  songs: Songs[];
  music_type: string;
};

function useSearch() {
  const [startSearch, setStartSearch] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const url = startSearch ? `http://localhost:8000/search?query=${query}` : null;
  const options = { revalidateOnFocus: false };
  const { data, error, isLoading } = useSWR<SongsData>(url, handleFetch, options);

  return { data, error, isLoading, query, setQuery, setStartSearch };
}

export { useSearch };
