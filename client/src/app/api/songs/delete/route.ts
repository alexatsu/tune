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

  await db.user.update({
    where: {
      email: userEmail,
    },
    data: {
      Songs: {
        delete: {
          id: songId,
        },
      },
    },
  });

  await db.$disconnect();

  return NextResponse.json(
    { message: "Song removed successfully from database", data: findUser.Songs },
    { status: 200 },
  );
}
