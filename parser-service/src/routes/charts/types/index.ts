type Tracks = {
  title: string;
  urlId: string;
  url: string;
  duration: string;
  cover: string;
};

type Charts = {
  [key: string]: Tracks[];
};

export type { Charts, Tracks };
