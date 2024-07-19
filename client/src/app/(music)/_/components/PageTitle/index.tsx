"use client";
import { HeaderMenu } from "@/app/_/layouts";

import { useMobile } from "../../hooks";
import styles from "./styles.module.scss";

export function PageTitle({
  title,
  children: categoryButton,
}: {
  title: string;
  children?: JSX.Element;
}) {
  const isMobile = useMobile(576);

  return isMobile ? (
    <div className={styles.mobileTitleContainer}>
      <div className={styles.mobileCategoryBlock}>
        <h1 className={styles.pageTitle}>{title}</h1>
        {categoryButton}
      </div>
      <HeaderMenu />
    </div>
  ) : (
    <div className={styles.desktopTitleContainer}>
      <h1 className={styles.pageTitle}>{title}</h1>
      {categoryButton}
    </div>
  );
}
