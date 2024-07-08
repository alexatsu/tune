"use client";

import { useSession } from "next-auth/react";

import { AlbumModal } from "@/albums/_/components";
import { useCreateAlbum } from "@/albums/_/hooks";

export function CreateAlbumModal() {
  const { data: session } = useSession();
  const { title, description, modalVisible, setModalVisible, createAlbum, error } =
    useCreateAlbum(session);

  return (
    <AlbumModal
      submit={createAlbum}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      title={title}
      description={description}
      error={error}
    />
  );
}
