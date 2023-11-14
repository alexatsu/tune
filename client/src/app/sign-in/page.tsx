import { icons } from "@/shared/components/icons";

import page from "./_root/sass/Page.module.scss";
import btn from "@/shared/sass/components/Button.module.scss";

const { Github, Google } = icons;

export default function Page() {
  return (
    <main className={page.main}>
      <div className={page.buttonChunk}>
        <button className={btn.signIn}>
          <div className={page.btnContainer}>
            <span>Sign in with</span> <Github />
          </div>
        </button>

        <button className={btn.signIn}>
          <div className={page.btnContainer}>
            <span>Sign in with</span> <Google />
          </div>
        </button>
      </div>
    </main>
  );
}
