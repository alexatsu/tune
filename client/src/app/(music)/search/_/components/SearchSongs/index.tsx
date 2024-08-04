"use client";
import { useSession } from "next-auth/react";
import { useCallback } from "react";

import { useSearchStore } from "@/app/(music)/_/store";
import { playerIcons } from "@/music/_/components/icons/player";
import { SongsResponse } from "@/music/_/types";

import styles from "./styles.module.scss";

const { TriggerSearch } = playerIcons;

function SearchSongs() {
  const { data: session } = useSession();
  const { input, setInput, isLoading, setIsLoading, setError, setMusicList } = useSearchStore();

  const searchSongsFromQuery = useCallback(async () => {
    if (isLoading) {
      return;
    }

    if (!input || input.trim() === "") {
      return;
    }

    const url = `/api/songs/search?query=${input}`;
    setIsLoading(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session }),
      });

      if (!response.ok) {
        const error = (await response.json()) as Error;
        setError(error);
        return;
      }

      const data = (await response.json()) as SongsResponse;
      setMusicList(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [session, input, isLoading, setError, setMusicList, setIsLoading]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchSongsFromQuery();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            placeholder="look for songs/artists or paste the url"
            className={styles.input}
            value={input}
            onChange={handleInputChange}
          />
          <button disabled={isLoading} className={styles.buttonSearch} type="submit">
            <TriggerSearch />
          </button>
        </div>
      </form>
    </>
  );
}

export { SearchSongs };
