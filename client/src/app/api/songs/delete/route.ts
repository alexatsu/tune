//click delete song from my music
//fetch db and check if user exist
//then delete song from user music in db
//done

//check if music has user relations
//if there is none, then send request to music-service and delete folder with a music

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/api/_/services";

type Props = {
  email: string;
  songId: string;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, songId }: Props = body;

  const findUser = await db.user.findUnique({
    where: { email },
    include: {
      Songs: true,
    },
  });

  if (!findUser) {
    return NextResponse.json(
      {
        user: null,
        message: "User not found",
      },
      { status: 404 }
    );
  }

  const findSongForDeletion = findUser.Songs.find((song) => song.id === songId);

  await db.user.update({
    where: { email },
    data: {
      Songs: {
        delete: findSongForDeletion,
      },
    },
  });

  return NextResponse.json(
    { message: "Song removed successfully from database", data: findUser.Songs },
    { status: 200 }
  );
}
