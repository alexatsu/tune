//click delete song from my music
//fetch db and check if user exist
//then delete song from user music in db
//done

//check if music has user relations
//if there is none, then send request to music-service and delete folder with a music

import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";

import { db } from "@/api/_/services";

type Props = {
  session: Session;
  songId: string;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { session, songId }: Props = body;

  if (!session) {
    return NextResponse.json({ user: null, message: "Session is required" }, { status: 404 });
  }

  const userEmail = session?.user?.email || "";

  const findUser = await db.user.findUnique({
    where: { email: userEmail },
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
      { status: 404 },
    );
  }

  const findSongForDeletion = findUser.Songs.find((song) => song.id === songId);

  await db.user.update({
    where: { email: userEmail },
    data: {
      Songs: {
        delete: findSongForDeletion,
      },
    },
  });

  await db.$disconnect();

  return NextResponse.json(
    { message: "Song removed successfully from database", data: findUser.Songs },
    { status: 200 },
  );
}
