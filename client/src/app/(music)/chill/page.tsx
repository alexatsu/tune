import { ChillList } from "./_/components";
import styles from "./styles.module.scss";

export default function page() {
  return (
    <div className={styles.chillPageContainer}>
      <ChillList />
    </div>
  );
}
