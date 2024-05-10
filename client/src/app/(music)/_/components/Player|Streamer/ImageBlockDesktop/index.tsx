import Image from "next/image";
import { MutableRefObject } from "react";

import { Stream } from "@/app/(music)/chill/_/types";

import { Song } from "../../../types";
import styles from "./styles.module.scss";

type ImageBlockProps = {
  isLoading: boolean;
  currentPlayRef: MutableRefObject<Song | null> | MutableRefObject<Stream | null>;
};

export function ImageBlockDesktop({ isLoading, currentPlayRef }: ImageBlockProps) {
  return (
    <div className={styles.imageBlockDesktop}>
      {isLoading ? (
        <div className={styles.skeletonImage} />
      ) : currentPlayRef?.current ? (
        <Image
          src={currentPlayRef.current?.cover || ""}
          alt="cover"
          width={50}
          height={50}
          unoptimized
        />
      ) : (
        <div className={styles.imagePlaceholder} />
      )}
    </div>
  );
}
