import { Logo, MenuDropdown } from "../components";
import sass from "../sass/layouts/Header.module.scss";

export function Header() {
  return (
    <header className={sass.header}>
      <Logo />
      <MenuDropdown />
    </header>
  );
}
