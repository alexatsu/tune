type StreamResponse = {
  message: string;
  streams: Stream[];
  type: string;
};

type Stream = {
  urlId: string;
  title: string;
  url: string;
  cover: string;
  duration?: "";
};

export type { Stream, StreamResponse };
