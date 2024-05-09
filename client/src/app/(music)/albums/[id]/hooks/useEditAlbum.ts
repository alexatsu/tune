import { Session } from "next-auth";
import { FormEvent, useRef } from "react";

import { customRevalidateTag, handleFetch } from "@/shared/utils/functions";

export function useEditAlbum(session: Session | null, albumId: string) {
  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);

  const editAlbum = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const titleValue = title.current?.value || "";
    const descriptionValue = description.current?.value || "";

    if (titleValue && descriptionValue) {
      await handleFetch("/api/albums/edit", "PUT", {
        session,
        id: albumId,
        title: titleValue,
        description: descriptionValue,
      });

      customRevalidateTag(`/albums/${albumId}`);
    }
  };

  return { editAlbum, title, description };
}
