import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/shared/utils/functions";

import { Chartlist } from "./_/components";
import styles from "./styles.module.scss";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  return (
    <div>
      <Chartlist />
    </div>
  );
}
