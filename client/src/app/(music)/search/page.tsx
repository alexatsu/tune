import { SearchSongs } from "./_/components/SearchSongs";
import styles from "./styles.module.scss";

export default function Page() {
  return (
    <div className={styles.container}>
      <SearchSongs />
    </div>
  );
}
