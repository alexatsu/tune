import styles from "./styles.module.scss";

export function Skeleton() {
  return (
    <div className={styles.skeletonContainer}>
      {[...Array(5).keys()].map((_, index) => (
        <div key={index} className={styles.skeleton}>
          <div className={styles.skeletonImgPlaceholder} />
        </div>
      ))}
    </div>
  );
}
