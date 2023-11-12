import Link from "next/link";

import sass from "@/shared/sass/components/Logo.module.scss";

export function Logo() {
  return (
    <Link href={"/"} className={sass.logo}>
      <h1>Tune</h1>
    </Link>
  );
}
