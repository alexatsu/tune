"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import { MusicList } from "@/music/_/components";

import { playerIcons } from "@/music/_/components/icons/player";
import styles from "./styles.module.scss";
import { useSearch } from "@/app/(music)/_/hooks";

const { TriggerSearch } = playerIcons;

function SearchSongs() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { data: session } = useSession();
  const { setQuery, setStartSearch, data, error, isLoading} = useSearch();

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
      {isLoading ? (
        <div style={{ color: "white" }}>Loading...</div>
      ) : (
        <MusicList songs={data?.songs || null} session={session} />
      )}
    </>
  );
}

export { SearchSongs };
