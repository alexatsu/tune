"use client";
import { handleFetch } from "@/shared/utils/functions";
import { Album } from "@prisma/client";
import { Session } from "next-auth";
import { useRef, useState, FormEvent } from "react";
import { useSWRConfig } from "swr";

import styles from "./styles.module.scss";

export function AlbumModal({ session }: { session: Session }) {
  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState(false);
  const { mutate } = useSWRConfig();

  const modalClasses: string[] = [styles.Modal];

  function getRandomColorInRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateRandomTwoColorGradient() {
    const color1 = () => getRandomColorInRange(0, 124);
    const color2 = () => getRandomColorInRange(125, 255);

    return [
      `rgba(${color1()}, ${color1()}, ${color1()},0.8)`,
      `rgba(${color2()}, ${color2()}, ${color2()},0.8)`,
    ];
  }
  const createAlbum = async (event: FormEvent<HTMLButtonElement>) => {
    if (description.current && title.current) {
      event.preventDefault();

      if (!description.current.value || !title.current.value) {
        return alert("Fill in all fields");
      }

      const newAlbum = {
        description: description.current.value,
        title: title.current.value,
        gradient: `linear-gradient(215deg, ${generateRandomTwoColorGradient()[1]} 30%, ${generateRandomTwoColorGradient()[0]} 60%)`,
      } as Album;

      const response = await handleFetch(
        "/api/albums/create",
        "POST",
        { ...newAlbum, session: session },
        {
          "Content-Type": "application/json",
        },
      );

      setVisible(false);
      console.log(response);
      await mutate("/api/albums/get-all");
    }
  };

  if (visible) {
    modalClasses.push(styles.active);
  }

  return (
    <div className={styles.createAlbumModalContainer}>
      <button className={styles.btn} onClick={() => setVisible(true)}></button>
      <div className={modalClasses.join(" ")} onClick={() => setVisible(false)}>
        <form
          className={styles.Content}
          onClick={(event: React.MouseEvent<HTMLFormElement>) => event.stopPropagation()}
        >
          <input
            type="text"
            id="title"
            ref={title}
            className={styles.input}
            required
            placeholder="Title"
          />
          <input
            type="text"
            id="description"
            ref={description}
            className={styles.input}
            required
            placeholder="Description"
          />
          <button type="submit" className={styles.submitButton} onClick={createAlbum}>
            Click
          </button>
        </form>
      </div>
    </div>
  );
}
