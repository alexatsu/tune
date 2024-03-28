"use client";
import React from "react";

import styles from "./styles.module.scss";

interface Props {
  gradient: string;
  title: string;
  description: string;
  onClick: () => void;
  cover?: string;
}

export function Album({ cover, description, onClick, title, gradient }: Props) {
  return (
    <div className={styles.Album} onClick={onClick}>
      <div className={styles.imageOrRgb}>
        <img src={cover} alt="" />
        <div className={styles.rgb} style={{ background: gradient }}></div>
      </div>
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        <h5 className={styles.description}>{description}</h5>
      </div>
    </div>
  );
}
