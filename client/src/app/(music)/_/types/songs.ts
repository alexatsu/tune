type Song = {
  id: string;
  title: string;
  duration: string;
  url: string;
  urlId: string;
  addedAt: Date;
  userId: string;
  storage: string;
  cover: string;
};

type SongsResponse = {
  message: string;
  songs: Song[];
};

export type { SongsResponse, Song };
