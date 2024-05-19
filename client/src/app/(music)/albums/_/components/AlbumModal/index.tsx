"use client";
import { FormEvent, RefObject } from "react";

import styles from "./styles.module.scss";

export function AlbumModal<T extends (event: FormEvent<HTMLButtonElement>) => Promise<void>>({
  submit,
  modalVisible,
  setModalVisible,
  title,
  description,
}: {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  submit: T;
  title: RefObject<HTMLInputElement>;
  description: RefObject<HTMLInputElement>;
}) {
  const modalClasses: string[] = [styles.Modal];

  if (modalVisible) {
    modalClasses.push(styles.active);
  }

  return (
    <div className={styles.createAlbumModalContainer}>
      <button className={styles.btn} onClick={() => setModalVisible(true)}></button>
      <div className={modalClasses.join(" ")} onClick={() => setModalVisible(false)}>
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
          <button type="submit" className={styles.submitButton} onClick={(e) => submit(e)}>
            Click
          </button>
        </form>
      </div>
    </div>
  );
}
