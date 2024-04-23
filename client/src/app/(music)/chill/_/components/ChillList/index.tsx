"use client";

import useSWR from "swr";

import type { StreamResponse } from "@/app/(music)/chill/_/types";

import { ChillCard } from "../ChillCard";
import styles from "./styles.module.scss";

export function ChillList() {
  const fetchAllStreams = async () => {
    const response = await fetch(`/api/chill/stream`);

    return response.json();
  };

  const { data, error, isLoading, mutate } = useSWR<StreamResponse>(
    `/api/songs/get-all`,
    fetchAllStreams,
    { revalidateOnFocus: false },
  );

  return (
    <div className={styles.chillBlock}>
      {data?.streams?.map(({ id, title, cover, url }) => {
        return <ChillCard title={title} id={id} cover={cover} url={url} key={id} />;
      })}
    </div>
  );
}
