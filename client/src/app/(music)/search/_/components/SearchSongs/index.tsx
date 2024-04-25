"use client";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";

import { SongsResponse } from "@/app/(music)/_/types";
import { MusicList, Skeleton } from "@/music/_/components";
import { playerIcons } from "@/music/_/components/icons/player";

import styles from "./styles.module.scss";

const { TriggerSearch } = playerIcons;

function SearchSongs() {
  const { data: session } = useSession();
  const [data, setData] = useState<SongsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [input, setInput] = useState("");

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
      setData(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [session, input, isLoading]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchSongsFromQuery();
  };

  const handleErrorRecovery = () => {
    setError(null);
    searchSongsFromQuery();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  return (
    <>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="search songs"
          className={styles.input}
          value={input}
          onChange={handleInputChange}
        />
        <button disabled={isLoading} className={styles.buttonSearch} type="submit">
          <TriggerSearch />
        </button>
      </form>

      {error && !isLoading && (
        <div>
          <p style={{ color: "white", marginBottom: "10px" }}>
            Something went wrong. Error message: {error.message}
          </p>
          <button
            style={{
              color: "white",
              backgroundColor: "var(--widget-bg)",
              padding: "0.5rem",
              borderRadius: "10px",

              border: "none",
              cursor: "pointer",
            }}
            onClick={handleErrorRecovery}
          >
            Retry
          </button>
        </div>
      )}
      {isLoading ? (
        <div className={styles.musicListSkeletonContainer}>
          <Skeleton className={styles.musicListSkeleton} />
        </div>
      ) : (
        <MusicList data={data || undefined} session={session!} />
      )}
    </>
  );
}

export { SearchSongs };
