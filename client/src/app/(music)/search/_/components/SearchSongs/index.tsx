"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import { SongsResponse } from "@/music/_/types";
import { MusicList } from "@/music/_/components";

import { handleFetch } from "@/shared/utils/functions";
import { playerIcons } from "@/music/_/components/icons/player";
import styles from "./styles.module.scss";

const { TriggerSearch } = playerIcons;

function SearchSongs() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState("");
  const [startSearch, setStartSearch] = useState(false);
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
    <>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="search songs" className={styles.input} ref={inputRef} />

        <button
          disabled={isLoading}
          className={styles.buttonSearch}
          type="submit"
          onClick={handleSearch}
        >
          <TriggerSearch />
        </button>
      </form>

      {error && !isLoading ? <div style={{ color: "white" }}>{error.message}</div> : ""}
      {isLoading ? (
        <div style={{ color: "white" }}>Loading...</div>
      ) : (
        <MusicList songs={data?.songs || undefined} session={session} />
      )}
    </>
  );
}

export { SearchSongs };
