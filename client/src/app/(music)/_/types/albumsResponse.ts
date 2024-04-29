import { Song } from "./songs";

type Album = {
  id: string;
  title: string;
  description: string;
  cover?: string;
  gradient: string;
  userId: string;
  songs: Song[];
};

type AlbumsResponse = {
  message: string;
  albums: Album[];
};

type AlbumIdResponse = {
  message: string;
  album: Album;
};

export type { AlbumIdResponse, AlbumsResponse };
