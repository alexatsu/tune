type ChartSongs = {
  title: string;
  cover: string;
  urlId: string;
  url: string;
  duration: string;
  view_count: number;
};

type ChartsCategories = {
  [key: string]: ChartSongs[];
};
type ChartsResponse = {
  message: string;
  data: ChartsCategories;
};

export type { ChartsCategories, ChartSongs, ChartsResponse };
