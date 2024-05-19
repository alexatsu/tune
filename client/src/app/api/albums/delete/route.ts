import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";

import { db } from "@/api/_/services";

type AlbumUpdateRequest = {
  session: Session;
  id: string;
};

export async function POST(req: NextRequest) {
  const { session, id }: AlbumUpdateRequest = await req.json();

  const userEmail = session?.user?.email || "";

  if (!session) {
    return NextResponse.json({ user: null, message: "Session is required" }, { status: 404 });
  }

  if (!userEmail) {
    return NextResponse.json({ user: null, message: "Email is required" }, { status: 400 });
  }

  const userAlbum = await db.user.findUnique({
    where: { email: userEmail },
    select: {
      Albums: true,
    },
  });

  const findAlbum = userAlbum?.Albums?.find((album) => album.id === id);

  if (!findAlbum) {
    return NextResponse.json({ message: "Album not found" }, { status: 404 });
  }

  await db.albumSong.deleteMany({
    where: { albumId: id },
  });

  await db.album.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Album deleted successfully", userAlbum }, { status: 200 });
}
