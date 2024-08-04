import styles from "./styles.module.scss";

export function LoadContainer() {
  return (
    <div className={styles.container}>
      <div className={styles.pulsingBall}></div>
    </div>
  );
}
