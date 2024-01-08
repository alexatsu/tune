"use client";

import { useRef, useState } from "react";
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

function SearchMusic() {
  const { handlePlay, currentTrack, loadPlayerSource } = usePlayerContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState<string>("");
  const [startSearch, setStartSearch] = useState<boolean>(false);

  const url = startSearch ? `http://localhost:8000/search?query=${query}` : null;
  const options = { revalidateOnFocus: false };
  const { data, error, isLoading } = useSWR<SongsData>(url, handleFetch, options);

  const handleSearch = () => {
    setStartSearch(true);

    const input = inputRef.current;
    if (!input) return;

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

  const addSongToMyMusic = async (url: string, id: string) => {
    // i send req to python server/download track/cut and store it in saved send response back to client that track added

    const { error, message } = await handleFetch<{ message: string; error: string }>(
      "http://localhost:8000/add-to-my-music",
      "POST",
      { url, id }
    );
    console.log(error, message);

    // send query to database to add track to my music

    // revalidate client with new data
  };

  return (
    <>
      <button onClick={handlePlay}>Test play</button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setStartSearch(true);
        }}
      >
        <input type="text" placeholder="search music" className={styles.input} ref={inputRef} />

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
                <button onClick={() => addSongToMyMusic(url, id)}>Add</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export { SearchMusic };
