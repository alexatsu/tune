import Link from "next/link";

import { PageTitle } from "../_/components";
import PageContainer from "../_/layouts/PageContainer";
import { ThemesBlock } from "./_/layouts";
import styles from "./styles.module.scss";

export default function Page() {
  return (
    <PageContainer>
      <PageTitle title={"Settings"} />
      <ThemesBlock />
      <section className={styles.text}>
        <p>
          Coming soon, but for now check out <Link href={"/allmusic"}>Music</Link>
        </p>
      </section>
    </PageContainer>
  );
}
