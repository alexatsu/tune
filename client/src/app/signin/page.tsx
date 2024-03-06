import { authOptions } from "@/shared/utils/functions";
import { GithubSignIn, GoogleSignIn } from "./_/components";

import styles from "./page.module.scss";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  console.log(session?.user, "here is the session");
  return (
    <main className={styles.main}>
      <div className={styles.buttonChunk}>
        <GithubSignIn />
        <GoogleSignIn />
      </div>
    </main>
  );
}
