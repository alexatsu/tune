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
  type: string;
};

export type { Song, SongsResponse };
