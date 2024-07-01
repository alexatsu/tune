type Song = {
  title: string;
  duration: string;
  url: string;
  urlId: string;
  cover: string | null;
  id?: string;
  addedAt?: Date;
  userId?: string;
  uuid?: string;
};

type SongsResponse = {
  message: string;
  songs: Song[];
  type: string;
};

export type { Song, SongsResponse };
