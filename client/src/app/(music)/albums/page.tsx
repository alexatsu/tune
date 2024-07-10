import { PageTitle } from "@/music/_/components";

import { AlbumList } from "./_/components";
import styles from "./styles.module.scss";

export default function Page() {
  return (
    <div className={styles.pageContainer}>
      <PageTitle title={"Albums"} />
      <AlbumList />
    </div>
  );
}
