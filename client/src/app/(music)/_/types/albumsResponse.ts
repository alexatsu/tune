type Album = {
  id?: string;
  title: string;
  description: string;
  cover?: string;
  gradient: string;
  userId?: string;
};

type AlbumsResponse = {
  message: string;
  albums: Album[];
};

type AlbumResponse = {
  message: string;
  album: Album;
};

export type { Album, AlbumResponse, AlbumsResponse };
