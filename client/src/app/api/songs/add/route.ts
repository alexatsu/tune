import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";

import { db } from "@/api/_/services";

type Props = {
  session: Session;
  url: string;
  id: string;
  title: string;
  duration: string;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { session, url, id, title, duration }: Props = body;

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

  const checkIfSongAlreadyExist = findUser.Songs.find((song) => song.urlId === id);

  if (checkIfSongAlreadyExist) {
    return NextResponse.json(
      { user: null, message: "Song already exists in database" },
      { status: 200 }
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

  await db.$disconnect();
  
  return NextResponse.json({ message: "Song added successfully in database" }, { status: 201 });
}
