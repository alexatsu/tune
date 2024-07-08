import { Session } from "next-auth";
import { FormEvent, useRef, useState } from "react";

import { handleFetch } from "@/app/_/utils/functions";
import { useAlbums } from "@/app/(music)/_/hooks";
import { Album } from "@/music/_/types";

import { generateRandomTwoColorGradient } from "../utils";

export function useCreateAlbum(session: Session | null) {
  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { albumsMutate } = useAlbums();

  const createAlbum = async (event: FormEvent<HTMLButtonElement>) => {
    const [gradient1, gradient2] = generateRandomTwoColorGradient();
    if (description.current && title.current) {
      event.preventDefault();

      if (!description.current.value || !title.current.value) {
        return alert("Fill in all fields");
      }

      const newAlbum = {
        description: description.current.value,
        title: title.current.value,
        gradient: `linear-gradient(215deg, ${gradient2} 30%, ${gradient1} 60%)`,
      } as Album;

      const response = await handleFetch(
        "/api/albums/create",
        "POST",
        { ...newAlbum, session },
        { "Content-Type": "application/json" },
      );

      setModalVisible(false);
      albumsMutate();
    }
  };

  return { createAlbum, modalVisible, setModalVisible, title, description };
}
