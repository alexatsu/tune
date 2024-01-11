import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/services";

type Props = {
  email: string;
  url: string;
  id: string;
  title: string;
  duration: string;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, url, id, title, duration }: Props = body;

  const findUser = await db.user.findUnique({
    where: { email },
    include: {
      allSongs: true,
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

  const checkIfSongAlreadyExist = findUser.allSongs.find((song) => song.urlId === id);

  if (checkIfSongAlreadyExist) {
    return NextResponse.json(
      {
        user: null,
        message: "Song already exists in database",
      },
      { status: 409 }
    );
  }

  await db.song.create({
    data: {
      title,
      duration,
      url,
      urlId: id,
      storage: "saved",
      addedAt: new Date(),
      userId: findUser.id,
    },
  });

  return NextResponse.json({ message: "Song added successfully in database" }, { status: 201 });
}
