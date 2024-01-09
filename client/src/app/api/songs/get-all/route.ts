import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/services";
import { NextApiRequest } from "next";

export async function GET(req: NextApiRequest, { params }: { params: { email: string } }) {
  const email = req.query.email as string;
  console.log(email, "triggered");
  const userSongs = await db.user.findUnique({
    where: { email: email },
    include: {
      allSongs: true,
    },
  });

  return NextResponse.json(
    {
      songs: userSongs?.allSongs,
      message: "Songs fetched successfully",
    },
    { status: 200 }
  );
}
