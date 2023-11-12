import { Logo } from "../components/Logo";
import { icons } from "../components/icons";

import sass from "../sass/layouts/Header.module.scss";

const { Menu } = icons;

export function Header() {
  return (
    <header className={sass.header}>
      <Logo />
      <Menu />
    </header>
  );
}
