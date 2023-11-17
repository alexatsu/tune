import { GithubSignIn, GoogleSignIn } from "@/shared/components";

import page from "./_root/sass/Page.module.scss";

export default function Page() {
  return (
    <main className={page.main}>
      <div className={page.buttonChunk}>
        <GithubSignIn />
        <GoogleSignIn />
      </div>
    </main>
  );
}
