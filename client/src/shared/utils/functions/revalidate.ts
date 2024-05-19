"use server";

import { revalidatePath } from "next/cache";

const customRevalidatePath = (tag: string) => {
  revalidatePath(tag);
};

export { customRevalidatePath };
