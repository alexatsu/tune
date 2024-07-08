import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/_/utils/functions";
import { db } from "@/app/api/_/services";
import { MusicList } from "@/music/_/components";
import { AlbumSongs } from "@/music/_/types";
import { attachUUIDToSongs } from "@/music/_/utils/functions";

import { AlbumMenuDropdown } from "./components";
import styles from "./styles.module.scss";

const fetchAlbumById = async (id: string) => {
  const userAlbum = await db.album.findUnique({
    where: { id: id },
    include: { albumSongs: true },
  });

  const albumSongs = attachUUIDToSongs(userAlbum?.albumSongs || []);

  const musicList = {
    songs: albumSongs as AlbumSongs[],
    message: `success, albumId is ${id}`,
    type: "album",
    id,
  };

  await db.$disconnect();

  return { userAlbum, musicList };
};

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const { id } = params;

  if (!session) redirect("/signin");
  const { userAlbum, musicList } = await fetchAlbumById(id);

  return (
    <div className={styles.albumIdPageContainer}>
      <div className={styles.AlbumHead}>
        <div className={styles.Cover} style={{ background: userAlbum?.gradient }}></div>
        <div className={styles.Content}>
          <h1 className={styles.Title}>{userAlbum?.title}</h1>
          <span className={styles.Description}>{userAlbum?.description}</span>
        </div>
        <AlbumMenuDropdown albumId={id} />
      </div>

      {userAlbum?.albumSongs && userAlbum?.albumSongs.length < 1 ? (
        <div className={styles.noSongsWereAdded}>
          No songs were added. Look for them in <Link href={"/allmusic"}>Music</Link>
        </div>
      ) : (
        <div className={styles.AlbumList}>
          <MusicList data={musicList} session={session} albumId={id} />
        </div>
      )}
    </div>
  );
}
