import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/api/_/services";
import { Song } from "@/app/(music)/_/types";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const { email } = await request.json();

  const res = await fetch(`http://music-service:8000/search?query=${query}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: { songs: Song[]; message: string } = await res.json();

  const userSongs = await db.user.findUnique({
    where: { email },
    select: {
      Songs: true,
    },
  });

  const attachIsAddedToSongs: (Song & { isAdded: boolean })[] = data.songs.map((song: Song) => {
    const findInUser = userSongs?.Songs.find((userSong) => {
      return userSong.urlId === song.id;
    });
    return { ...song, isAdded: findInUser ? true : false };
  });

  // console.log(attachIsAddedToSongs, "here is the attached songs");

  return NextResponse.json({ songs: attachIsAddedToSongs, message: "success" }, { status: 200 });
}
