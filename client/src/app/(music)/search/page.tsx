import { redirect } from "next/navigation";
import { SearchSongs } from "./_/components/SearchSongs";

import styles from "./styles.module.scss";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/utils/functions";

export default async function Page() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/signin");

  return (
    <div className={styles.searchContainer}>
      <SearchSongs />
    </div>
  );
}
