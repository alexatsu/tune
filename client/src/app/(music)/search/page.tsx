import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/_/utils/functions";

import { SearchSongs } from "./_/components/SearchSongs";
import styles from "./styles.module.scss";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  return (
    <div className={styles.searchContainer}>
      <SearchSongs />
    </div>
  );
}
