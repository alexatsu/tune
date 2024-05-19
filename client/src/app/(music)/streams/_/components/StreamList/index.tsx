"use client";

import useSWR from "swr";

import { Skeleton } from "@/app/(music)/_/components/Skeleton";
import type { StreamResponse } from "@/music/_/types";

import { StreamCard } from "../StreamCard";
import styles from "./styles.module.scss";

export function StreamList() {
  const fetchAllStreams = async () => {
    const response = await fetch(`/api/streams/all`);

    return response.json();
  };

  const { data, error, isLoading, mutate } = useSWR<StreamResponse>(
    `/api/streams/all`,
    fetchAllStreams,
    { revalidateOnFocus: false },
  );

  return (
    <div className={styles.streamBlock}>
      {isLoading ? (
        <Skeleton className={styles.streamListSkeleton} />
      ) : (
        data?.streams?.map((stream) => {
          return <StreamCard stream={stream} key={stream.urlId} data={data} />;
        })
      )}
    </div>
  );
}
