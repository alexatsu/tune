type StreamResponse = {
  message: string;
  streams: Stream[];
};

type Stream = {
  id: string;
  title: string;
  url: string;
  cover: string;
};

export type { Stream, StreamResponse };
