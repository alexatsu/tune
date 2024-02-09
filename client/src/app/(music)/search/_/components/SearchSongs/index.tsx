"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";

import useSWR from "swr";
import { useSWRConfig } from "swr";

import { handleFetch } from "@/shared/utils/functions";
import { usePlayerContext } from "@/music/_/providers";
import { SongsResponse } from "@/music/_/types";

import styles from "./styles.module.scss";

//TODO:
// store api in .env
// improve error handling in ui

function SearchSongs() {
  const { handlePlay, currentTrack, loadPlayerSource } = usePlayerContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState<string>("");
  const [startSearch, setStartSearch] = useState<boolean>(false);

  const url = startSearch ? `http://localhost:8000/search?query=${query}` : null;
  const options = { revalidateOnFocus: false };
  const { data, error, isLoading } = useSWR<SongsResponse>(url, handleFetch, options);
  const { mutate } = useSWRConfig();
  const { data: session } = useSession();

  const handleSearch = () => {
    const input = inputRef.current;
    if (!input) return;

    if (input.value.trim() === "") return;

    setStartSearch(true);
    setQuery(input.value);
  };

  const listenToTemporalSong = async (url: string, id: string, duration: string) => {
    type ListenTemporal = {
      message: string;
      metadata: {
        url: string;
        id: string;
        title: string;
        duration: string;
      };
    };
    const response = await handleFetch<ListenTemporal>(
      "http://localhost:8000/listen-temporal",
      "POST",
      { url, id, duration }
    );

    const { message, metadata } = response;
    console.log(response, ' here is the listen temporal response')
    if (
      message === "Song downloaded successfully" ||
      message === "Song already exists in temporal, listening to it"
    ) {
      currentTrack.current = {
        id: "",
        url: "",
        title: "",
        duration: metadata.duration,
        userId: "",
        urlId: id,
        storage: "temporal",
        addedAt: new Date(),
      };

      loadPlayerSource();
      handlePlay();
    }
  };

  const addSongToMyMusic = async (url: string, id: string, title: string, duration: string) => {
    type SaveAndStoreProps = {
      message: string;
      metadata: {
        url: string;
        id: string;
        title: string;
        duration: string;
      };
      error: string;
    };

    const saveAndStoreSong = await handleFetch<SaveAndStoreProps>(
      "http://localhost:8000/save-and-store",
      "POST",
      { url, id }
    );

    const userEmail = session?.user?.email;

    const addSongDataToDB = await handleFetch<{ message: string }>(
      "http://localhost:3000/api/songs/add",
      "POST",
      { url, id, title, duration, email: userEmail }
    );

    mutate("http://localhost:3000/api/songs/get-all");
  };

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
          Search
        </button>
      </form>

      {error && !isLoading ? <div style={{ color: "white" }}>{error.message}</div> : ""}
      {isLoading ? (
        <div style={{ color: "white" }}>Loading...</div>
      ) : (
        <ul style={{ listStyle: "none" }}>
          {data?.songs?.map(({ id, url, title, duration }) => (
            <li style={{ color: "white" }} key={id}>
              <button onClick={() => listenToTemporalSong(url, id, duration)}>Listen</button>
              <span>
                {title} {duration}
              </span>
              <button onClick={() => addSongToMyMusic(url, id, title, duration)}>Add</button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export { SearchSongs };
