import { Song } from "./songs";

type AlbumSongs = Song & {
  songId: string;
};

type Album = {
  id: string;
  title: string;
  description: string;
  cover?: string | null;
  gradient: string;
  userId: string;
  albumSongs: AlbumSongs[];
};

type AlbumsResponse = {
  message: string;
  albums: Album[];
};

type AlbumIdResponse = {
  message: string;
  album: Album;
};

export type { Album, AlbumIdResponse, AlbumSongs, AlbumsResponse };
