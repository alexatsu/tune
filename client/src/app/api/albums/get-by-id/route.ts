import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";

import { db } from "@/api/_/services";

export async function POST(req: NextRequest) {
  const { session, id }: { session: Session; id: string } = await req.json();

  if (!session) {
    return NextResponse.json({ user: null, message: "Session is required" }, { status: 404 });
  }

  const userEmail = session?.user?.email || "";

  if (!userEmail) {
    return NextResponse.json({ songs: [], message: "Email is required" }, { status: 400 });
  }

  const userAlbums = await db.user.findUnique({
    where: { email: userEmail },
    select: {
      Albums: true,
    },
  });

  const userAlbum = await db.album.findUnique({
    where: { id: id },
    include: {
      Songs: true,
    },
  });

  await db.$disconnect();

  return NextResponse.json(
    { album: userAlbum, message: "Albums fetched successfully" },
    { status: 200 },
  );
}
