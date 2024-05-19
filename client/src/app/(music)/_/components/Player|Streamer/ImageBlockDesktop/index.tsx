import Image from "next/image";
import { MutableRefObject } from "react";

import { Stream } from "@/music/_/types";

import { Song } from "../../../types";
import styles from "./styles.module.scss";

type ImageBlockProps = {
  currentPlayRef: MutableRefObject<Song | Stream | null> | MutableRefObject<Stream | null>;
};

export function ImageBlockDesktop({ currentPlayRef }: ImageBlockProps) {
  return (
    <div className={styles.imageBlockDesktop}>
      {currentPlayRef?.current ? (
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
