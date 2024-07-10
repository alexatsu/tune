import Link from "next/link";

import { PageTitle } from "../_/components";
import PageContainer from "../_/layouts/PageContainer";
import styles from "./styles.module.scss";

export default function Page() {
  return (
    <PageContainer>
      <PageTitle title={"Settings"} />
      <section className={styles.text}>
        <p>
          Coming soon, but for now check out <Link href={"/allmusic"}>Music</Link>
        </p>
      </section>
    </PageContainer>
  );
}
