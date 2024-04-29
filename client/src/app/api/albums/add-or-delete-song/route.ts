import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../_/services";

type AddSongToAlbumProps = {
  session: Session;
  albumId: string;
  songId: string;
};

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const { session, albumId, songId }: AddSongToAlbumProps = body;
  console.log(session, albumId, songId, " here is the payload");

  if (!session) {
    return NextResponse.json({ user: null, message: "Session is required" }, { status: 404 });
  }

  const userEmail = session?.user?.email || "";

  const findUser = await db.user.findUnique({
    where: { email: userEmail },
    include: {
      Albums: {
        include: {
          Songs: true,
        },
      },
    },
  });

  if (!findUser) {
    return NextResponse.json({ user: null, message: "User not found" }, { status: 404 });
  }

  const findAlbum = findUser?.Albums.find((album) => {
    return album.id === albumId;
  });

  const checkIfSonginTheAlbum = findAlbum?.Songs.find((song) => {
    return song.id === songId;
  });

  console.log(checkIfSonginTheAlbum, " here is the answer");

  if (checkIfSonginTheAlbum) {
    await db.user.update({
      where: { email: userEmail },
      data: {
        Albums: {
          update: {
            where: { id: albumId },
            data: {
              Songs: {
                disconnect: {
                  id: songId,
                },
              },
            },
          },
        },
      },
      include: {
        Albums: true,
      },
    });

    await db.$disconnect();

    return NextResponse.json(
      { user: findUser, message: "Song removed from album" },
      { status: 200 },
    );
  } else {
    await db.user.update({
      where: { email: userEmail },
      data: {
        Albums: {
          update: {
            where: { id: albumId },
            data: {
              Songs: {
                connect: {
                  id: songId,
                },
              },
            },
          },
        },
      },
      include: {
        Albums: true,
      },
    });
  }
  await db.$disconnect();

  return NextResponse.json({ user: findUser, message: "Song added to album" }, { status: 200 });
}
