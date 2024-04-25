type ChillStreams = {
  url: string;
  title: string;
  id: string;
  cover: string;
};

type ChillStreamResponse = {
  message: string;
  streams: ChillStreams[];
};

export type { ChillStreamResponse, ChillStreams };
