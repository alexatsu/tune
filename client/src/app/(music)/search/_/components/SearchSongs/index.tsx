"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef } from "react";

import { Skeleton } from "@/app/(music)/_/components/Skeleton";
import { MusicList } from "@/music/_/components";
import { playerIcons } from "@/music/_/components/icons/player";
import { useSearch } from "@/music/_/hooks";

import styles from "./styles.module.scss";

const { TriggerSearch } = playerIcons;

function SearchSongs() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { data: session } = useSession();
  const { setQuery, setStartSearch, data, error, isLoading } = useSearch();

  const handleSearch = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;

    if (input.value.trim() === "") return;

    setStartSearch(true);
    setQuery(input.value);
    localStorage.setItem("query", input.value);
  }, [setQuery, setStartSearch]);

  useEffect(() => {
    const savedQuery = localStorage.getItem("query");
    if (savedQuery && inputRef.current) {
      setQuery(savedQuery);
      inputRef.current.value = savedQuery;
      handleSearch();
    }
  }, [handleSearch, setQuery]);

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
      {isLoading ? <Skeleton /> : <MusicList data={data || undefined} session={session!} />}
    </>
  );
}

export { SearchSongs };
