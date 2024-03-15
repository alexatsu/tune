import { NextRequest, NextResponse } from "next/server";

import { db } from "@/api/_/services";

export async function POST(req: NextRequest) {
  const { session } = await req.json();

  if (!session) {
    return NextResponse.json({ user: null, message: "Session is required" }, { status: 404 });
  }

  const userEmail = session?.user?.email || "";

  if (!userEmail) {
    return NextResponse.json({ songs: [], message: "Email is required" }, { status: 400 });
  }

  const userSongs = await db.user.findUnique({
    where: { email: userEmail },
    select: {
      Songs: true,
    },
  });

  await db.$disconnect();

  return NextResponse.json(
    { songs: userSongs?.Songs, message: "Songs fetched successfully" },
    { status: 200 },
  );
}
