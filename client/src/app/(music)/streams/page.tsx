import { PageTitle } from "@/music/_/components/PageTitle";

import { StreamList } from "./_/components";
import styles from "./styles.module.scss";

export default function page() {
  return (
    <div className={styles.streamsPageContainer}>
      <PageTitle title={"Streams"} />
      <StreamList />
    </div>
  );
}
