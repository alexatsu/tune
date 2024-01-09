"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import { handleFetch } from "@/shared/utils/functions";
import { usePlayerContext } from "@/app/(music)/_/providers";

import styles from "./styles.module.scss";

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

//TODO:
// store api in .env
// improve error handling in ui
// fix if input is empty

function SearchSongs() {
  const { handlePlay, currentTrack, loadPlayerSource } = usePlayerContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState<string>("");
  const [startSearch, setStartSearch] = useState<boolean>(false);

  const url = startSearch ? `http://localhost:8000/search?query=${query}` : null;
  const options = { revalidateOnFocus: false };
  const { data, error, isLoading } = useSWR<SongsData>(url, handleFetch, options);

  const { data: session } = useSession();

  const handleSearch = () => {
    const input = inputRef.current;
    if (!input) return;

    if (input.value.trim() === "") return;

    setStartSearch(true);
    setQuery(input.value);
  };

  if (error) return <div>{error.message}</div>;

  const listenToTemporalSong = async (url: string, id: string, duration: string) => {
    console.log("listen to song", url, id, duration);

    const apiUrl = "http://localhost:8000/listen-temporal";

    const { message } = await handleFetch<{ message: string }>(`${apiUrl}`, "POST", {
      url,
      id,
      duration,
    });

    if (message === "Song downloaded successfully" || message === "Song already exists") {
      currentTrack.current = `http://localhost:8000/audio/temporal/${id}/index.m3u8 `;
      loadPlayerSource();
      handlePlay();
    }
  };

  const addSongToMyMusic = async (url: string, id: string, title: string, duration: string) => {
    // i send req to python server/download track/cut and store it in saved send response back to client that track added
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

    if (saveAndStoreSong.error) {
      console.log(saveAndStoreSong.error);
      return;
    }

    if (saveAndStoreSong.message === "Song already exists in saved") {
      console.log("Song already exists in saved");
      return;
    }

    const useEmail = session?.user?.email;

    // send query to database to add track to my music
    const addSongDataToDB = await handleFetch<{ message: string }>(
      "http://localhost:3000/api/songs/add",
      "POST",
      { url, id, title, duration, email: useEmail }
    );

    console.log(addSongDataToDB.message, "added to my music in db");

    // revalidate client with new data
  };

  return (
    <>
      <button onClick={handlePlay}>Test play</button>
      <form onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="search songs" className={styles.input} ref={inputRef} />

        <button disabled={isLoading} type="submit" onClick={handleSearch}>
          Search
        </button>
      </form>

      <div>
        {isLoading ? (
          <div style={{ color: "white" }}>Loading...</div>
        ) : (
          <ul style={{ listStyle: "none" }}>
            {data?.songs.map(({ id, url, title, duration }) => (
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
      </div>
    </>
  );
}

export { SearchSongs };
