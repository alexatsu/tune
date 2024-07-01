import { v4 as uuid } from "uuid";

const attachUUIDToSongs = <T>(payload: T[]) => {
  return payload.map((song) => ({ ...song, uuid: uuid() }));
};

export { attachUUIDToSongs };
