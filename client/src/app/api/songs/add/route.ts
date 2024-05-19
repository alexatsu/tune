import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";

import { db } from "@/api/_/services";
import { Song } from "@/app/(music)/_/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { session, url, urlId, title, duration, cover }: Song & { session: Session } = body;

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
    return NextResponse.json({ user: null, message: "User not found" }, { status: 404 });
  }

  const checkIfSongAlreadyExist = findUser.Songs.find((song) => song.urlId === urlId);

  if (checkIfSongAlreadyExist) {
    return NextResponse.json(
      { user: null, message: "Song already exists in database" },
      { status: 200 },
    );
  }

  await db.song.create({
    data: {
      title,
      duration,
      url,
      urlId,
      cover: cover,
      addedAt: new Date(),
      userId: findUser.id,
    },
  });

  await db.$disconnect();

  return NextResponse.json({ message: "Song added successfully in database" }, { status: 201 });
}
