import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";

import { db } from "@/api/_/services";
import { Album, Song } from "@/app/(music)/_/types";

type AddSongToAlbumProps = {
  session: Session;
  album: Album;
  song: Song;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { session, album, song }: AddSongToAlbumProps = body;
  console.log(song, "add or delete song");
  if (!session) {
    return NextResponse.json({ user: null, message: "Session is required" }, { status: 404 });
  }

  const userEmail = session?.user?.email || "";

  const findUser = await db.user.findUnique({
    where: { email: userEmail },
    include: {
      Albums: {
        include: {
          albumSongs: true,
        },
      },
    },
  });

  if (!findUser) {
    return NextResponse.json({ user: null, message: "User not found" }, { status: 404 });
  }

  const findAlbum = findUser?.Albums.find((userAlbum) => {
    return userAlbum.id === album.id;
  });

  const checkIfSonginTheAlbum = findAlbum?.albumSongs.find((albumSong) => {
    return albumSong.urlId === song.urlId;
  });
  if (checkIfSonginTheAlbum) {
    await db.album.update({
      where: { id: album.id },
      data: {
        albumSongs: {
          delete: {
            id: checkIfSonginTheAlbum.id,
          },
        },
      },
    });

    return NextResponse.json(
      { user: findUser, message: "Song removed from album" },
      { status: 200 },
    );
  } else {
    await db.albumSong.create({
      data: {
        title: song.title,
        duration: song.duration,
        url: song.url,
        urlId: song.urlId,
        cover: song.cover,
        Album: { connect: { id: album.id } },
      },
    });
  }
  await db.$disconnect();

  return NextResponse.json({ user: findUser, message: "Song added to album" }, { status: 200 });
}
