import { GithubSignIn, GoogleSignIn, HomeButton } from "./_/components";
import styles from "./page.module.scss";

export default function Page() {
  return (
    <main className={styles.main}>
      <div className={styles.buttonChunk}>
        <GithubSignIn />
        <GoogleSignIn />
        <span className={styles.or}>or</span>
        <HomeButton />
      </div>
    </main>
  );
}
