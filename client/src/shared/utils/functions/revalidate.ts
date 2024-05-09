"use server";

import { revalidateTag } from "next/cache";

const customRevalidateTag = (tag: string) => {
  revalidateTag(tag);
};

export { customRevalidateTag };
