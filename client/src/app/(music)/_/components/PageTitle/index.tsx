import styles from "./styles.module.scss";

export function PageTitle({ title }: { title: string }) {
  return <h1 className={styles.pageTitle}>{title}</h1>;
}
