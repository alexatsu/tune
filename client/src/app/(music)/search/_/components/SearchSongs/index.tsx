"use client";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";

import { MusicList, Skeleton } from "@/music/_/components";
import { playerIcons } from "@/music/_/components/icons/player";
import { SongsResponse } from "@/music/_/types";
import { attachUUIDToSongs } from "@/music/_/utils/functions";

import styles from "./styles.module.scss";

const { TriggerSearch } = playerIcons;

function SearchSongs() {
  const { data: session } = useSession();
  const [data, setData] = useState<SongsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [input, setInput] = useState("");

  if (!session) redirect("/signin");

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

  const songsWithUUID = attachUUIDToSongs(data?.songs || []);

  const payload = {
    songs: songsWithUUID || [],
    message: data?.message || "",
    type: "search",
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

      {error && !isLoading && (
        <div>
          <p style={{ color: "white", marginBottom: "10px" }}>
            Something went wrong. Error message: {error.message}
          </p>
          <button className={styles.buttonRetry} onClick={handleErrorRecovery}>
            Retry
          </button>
        </div>
      )}
      {isLoading ? (
        <div className={styles.musicListSkeletonContainer}>
          <Skeleton className={styles.musicListSkeleton} />
        </div>
      ) : (
        <MusicList data={payload} session={session} />
      )}
    </>
  );
}

export { SearchSongs };
