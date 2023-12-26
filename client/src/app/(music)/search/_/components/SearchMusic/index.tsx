"use client";

import { useRef } from "react";

import { useSearch } from "@/shared/hooks";

import styles from "./styles.module.scss";
import { handleFetch } from "@/shared/utils/functions";

function SearchMusic() {
  const { data, isLoading, setQuery, error, setStartSearch } = useSearch();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSearch = () => {
    setStartSearch(true);

    if (!inputRef.current) return;
    const inputValue: string = inputRef.current.value;

    setQuery(inputValue);
  };

  if (error) return <div>{error.message}</div>;

  const listenToTemporalSong = (url: string, title: string, duration: string) => {
    console.log("listen to song", url, title, duration);
    const apiUrl = "http://localhost:8000/listen-temporal";
    const response = handleFetch<{ message: string }>(`${apiUrl}`, "POST", {
      url,
      title,
      duration,
    });

    console.log(response, " listen to song");
    return response;
  };

  return (
    <>
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
                <button onClick={() => listenToTemporalSong(url, title, duration)}>Listen</button>
                <span>{title}</span>
                <button onClick={() => console.log("add clicked", url)}>Add</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export { SearchMusic };
