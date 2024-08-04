"use client";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import { MusicList, Skeleton } from "@/app/(music)/_/components";
import { useSearchStore } from "@/app/(music)/_/store";
import { attachUUIDToSongs } from "@/app/(music)/_/utils/functions";

import { SearchSongs } from "../../components";
import styles from "./styles.module.scss";

export function SearchPageContainer() {
  const { data: session } = useSession();
  const { isLoading, error, musicList, setError } = useSearchStore();
  const songsWithUUID = attachUUIDToSongs(musicList?.songs || []);

  const payload = {
    songs: songsWithUUID || [],
    message: musicList?.message || "",
    type: "search",
  };

  if (!session) redirect("/signin");

  return (
    <div>
      <SearchSongs />
      {error && !isLoading && (
        <div>
          <p style={{ color: "white", marginBottom: "10px" }}>
            Something went wrong. Error message: {error.message}
          </p>
          <button className={styles.buttonRetry} onClick={() => setError(null)}>
            Retry
          </button>
        </div>
      )}
      {isLoading ? (
        <div className={styles.musicListSkeletonContainer}>
          <Skeleton className={styles.musicListSkeleton} />
        </div>
      ) : (
        <MusicList data={payload} session={session!} />
      )}
    </div>
  );
}
