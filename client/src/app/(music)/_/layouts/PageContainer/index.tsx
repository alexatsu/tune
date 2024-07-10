import styles from "./styles.module.scss";

export default function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className={styles.pageContainer}>{children}</div>;
}
