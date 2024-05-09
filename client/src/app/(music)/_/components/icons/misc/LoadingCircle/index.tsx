import { SVGProps } from "react";

import styles from "./styles.module.scss";

export function LoadingCircle({ style }: { style?: { [key: string]: string } }) {
  return <div className={styles.loader} style={{ ...style }} />;
}
