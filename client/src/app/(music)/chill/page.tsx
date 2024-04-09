import { ChillStreamResponse } from "@/shared/utils/types";

import { ChillCard } from "./_/components/ChillCard";
import styles from "./styles.module.scss";

async function getStreams() {
  const res = await fetch("http://localhost:3000/api/chill/stream");

  return res.json();
}

export default async function page() {
  const data = (await getStreams()) as ChillStreamResponse;

  return (
    <div className={styles.chillMainContainer}>
      <div className={styles.chillBlock}>
        {data.streams.map(({ id, title, cover, url }) => {
          return <ChillCard key={id} title={title} id={id} cover={cover} url={url} />;
        })}
      </div>
    </div>
  );
}
