type Song = {
  id: string;
  title: string;
  duration: string;
  url: string;
  urlId: string;
  addedAt?: Date;
  userId?: string;
  cover: string | null;
};

type SongsResponse = {
  message: string;
  songs: Song[];
};

export type { Song, SongsResponse };
