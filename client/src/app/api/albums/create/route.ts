import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";

import { db } from "@/api/_/services";

type Props = {
  session: Session;
  title: string;
  description: string;
  gradient: string;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { session, title, gradient, description }: Props = body;

  if (!session) {
    return NextResponse.json({ user: null, message: "Session is required" }, { status: 404 });
  }

  const userEmail = session?.user?.email || "";

  const findUser = await db.user.findUnique({
    where: { email: userEmail },
    include: {
      Albums: true,
    },
  });

  if (!findUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const checkIfAlbumExist = findUser.Albums.find((album) => album.title === title);

  if (checkIfAlbumExist) {
    return NextResponse.json(
      { message: "Album already exists in database" },
      // for some reasong 409 is not working
      { status: 200 },
    );
  }

  await db.album.create({
    data: {
      title,
      description,
      gradient,
      userId: findUser.id,
    },
  });

  await db.$disconnect();

  return NextResponse.json({ message: "Album added successfully in database" }, { status: 201 });
}
