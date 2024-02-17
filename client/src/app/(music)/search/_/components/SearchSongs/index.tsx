"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import useSWR, { useSWRConfig } from "swr";

import { handleFetch } from "@/shared/utils/functions";
import { usePlayerStore } from "@/shared/store";

import { usePlayerContext } from "@/music/_/providers";
import { SongsResponse } from "@/music/_/types";

import styles from "./styles.module.scss";
import { MusicList } from "@/app/(music)/_/components";

//TODO:
// improve error handling in ui

function SearchSongs() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  const [query, setQuery] = useState<string>("");
  const [startSearch, setStartSearch] = useState<boolean>(false);

  const { data: session } = useSession();

  const { data, error, isLoading } = useSWR<SongsResponse>(
    startSearch ? `http://localhost:8000/search?query=${query}` : null,
    handleFetch,
    { revalidateOnFocus: false }
  );

  const handleSearch = () => {
    const input = inputRef.current;
    if (!input) return;

    if (input.value.trim() === "") return;

    setStartSearch(true);
    setQuery(input.value);
    localStorage.setItem("query", input.value);
  };

  useEffect(() => {
    const savedQuery = localStorage.getItem("query");
    if (savedQuery && inputRef.current) {
      setQuery(savedQuery);
      inputRef.current.value = savedQuery;
      handleSearch();
    }
  }, []);


  return (
    <div style={{display: 'flex', flexDirection: "column"}} className={styles.contaienr}>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="search songs" className={styles.input} ref={inputRef} />

        <button
          disabled={isLoading}
          className={styles.buttonSearch}
          type="submit"
          onClick={handleSearch}
        >
          Search
        </button>
      </form>

      {error && !isLoading ? <div style={{ color: "white" }}>{error.message}</div> : ""}
      {isLoading ? (
        <div style={{ color: "white" }}>Loading...</div>
      ) : (
        <MusicList songs={data?.songs || undefined} session={session}/>
      )}
    </div>
  );
}

export { SearchSongs };
