import { StreamList } from "./_/components";
import styles from "./styles.module.scss";

export default function page() {
  return (
    <div className={styles.streamsPageContainer}>
      <StreamList />
    </div>
  );
}
