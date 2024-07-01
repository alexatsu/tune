type ChartSongs = {
  title: string;
  cover: string;
  urlId: string;
  url: string;
  duration: string;
  view_count: number;
  uuid?: string;
};

type ChartsCategories = {
  [key: string]: ChartSongs[];
};
type ChartsResponse = {
  message: string;
  data: ChartsCategories;
};

export type { ChartsCategories, ChartSongs, ChartsResponse };
