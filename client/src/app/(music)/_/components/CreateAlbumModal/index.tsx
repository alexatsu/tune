"use client";
import { Session } from "next-auth";
import React, { useRef, useState } from "react";

import { Album } from "@/music/_/types";
import { handleFetch } from "@/shared/utils/functions";

import styles from "./style.module.scss";

interface Props {
  session: Session;
}

export function CreateAlbumModal({ session }: Props) {
  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState(false);
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
  const createAlbum = async () => {
    if (description.current && title.current) {
      if (!description.current.value || !title.current.value) return alert("Заполните все поля");
      const newAlbum: Album = {
        description: description.current.value,
        title: title.current.value,
        gradient: `linear-gradient(215deg, ${generateRandomTwoColorGradient()[1]} 30%, ${generateRandomTwoColorGradient()[0]} 60%)`,
      };
      const response = await handleFetch(
        "/api/albums/add",
        "POST",
        { ...newAlbum, session: session },
        {
          "Content-Type": "application/json",
        },
      );
      setVisible(false);
      console.log(response);
    }
  };

  if (visible) {
    modalClasses.push(styles.active);
  }

  return (
    <div
      className={styles.AddAlbum}
      style={{
        background: `linear-gradient(180deg, rgba(26,30,31,1) 0%, rgba(15,18,19,1) 100%)`,
      }}
    >
      <button className={styles.btn} onClick={() => setVisible(true)}></button>
      <div className={modalClasses.join(" ")} onClick={() => setVisible(false)}>
        <div
          className={styles.Content}
          onClick={(event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation()}
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
          <button className={styles.submitButton} onClick={createAlbum}>
            Click
          </button>
        </div>
      </div>
    </div>
  );
}
