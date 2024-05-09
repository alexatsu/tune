import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession, Session } from "next-auth";

import { AlbumsResponse } from "@/music/_/types";
import { authOptions } from "@/shared/utils/functions";

import { AlbumCard } from "../AlbumCard";
import { CreateAlbumModal } from "./CreateAlbumModal";
import styles from "./styles.module.scss";

const fetchAllAlbums = async (session: Session) => {
  console.log(`${process.env.NEXTAUTH_URL}/api/albums/get-all`, "here is the next auth url");
  const url = `${process.env.NEXTAUTH_URL}/api/albums/get-all`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session }),
  });

  return response.json();
};

export async function AlbumList() {
  const session = await getServerSession(authOptions);
  const payload = (await fetchAllAlbums(session as Session)) as AlbumsResponse;

  if (!session) redirect("/signin");

  const data = payload?.albums;

  return (
    <div className={styles.AlbumList}>
      <CreateAlbumModal />
      {data?.map(({ id, gradient, title, description }) => (
        <Link key={id} href={`/albums/${id}`} style={{ textDecoration: "none" }}>
          <AlbumCard key={id} gradient={gradient} title={title} description={description} />
        </Link>
      ))}
    </div>
  );
}
