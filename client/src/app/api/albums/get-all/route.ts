import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";

import { db } from "@/api/_/services";

export async function POST(req: NextRequest) {
  const { session }: { session: Session } = await req.json();

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
      Albums: {
        include: {
          albumSongs: true,
        },
      },
    },
  });

  await db.$disconnect();

  return NextResponse.json(
    { albums: userAlbums?.Albums, message: "Albums fetched successfully" },
    { status: 200 },
  );
}
