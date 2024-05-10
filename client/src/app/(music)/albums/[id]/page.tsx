import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession, Session } from "next-auth";

import { MusicList } from "@/music/_/components";
import { AlbumIdResponse } from "@/music/_/types";
import { authOptions } from "@/shared/utils/functions";

import { AlbumMenuDropdown } from "./components";
import styles from "./styles.module.scss";

const fetchAlbumById = async (session: Session, id: string) => {
  const response = await fetch(`${process.env.CLIENT_URL}/api/albums/get-by-id`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session, id }),
  });

  return response.json();
};

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const { id } = params;
  const payload = (await fetchAlbumById(session as Session, id)) as AlbumIdResponse;

  if (!session) redirect("/signin");

  const musicList = {
    songs: payload?.album?.albumSongs || [],
    message: `success, albumId is ${id}`,
  };

  return (
    <div className={styles.albumIdPageContainer}>
      <div className={styles.AlbumHead}>
        <div className={styles.Cover} style={{ background: payload?.album?.gradient }}></div>
        <div className={styles.Content}>
          <h1 className={styles.Title}>{payload?.album?.title}</h1>
          <span className={styles.Description}>{payload?.album?.description}</span>
        </div>
        <AlbumMenuDropdown albumId={id} />
      </div>

      {musicList.songs.length < 1 ? (
        <div className={styles.noSongsWereAdded}>
          No songs were added. Look for them in <Link href={"/allmusic"}>Music</Link>
        </div>
      ) : (
        <div className={styles.AlbumList}>
          <MusicList data={musicList} session={session} />
        </div>
      )}
    </div>
  );
}
