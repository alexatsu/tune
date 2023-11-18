"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { sharedIcons } from "./icons";
import sass from "../sass/components/MenuDropdown.module.scss";

const { Menu } = sharedIcons;

export function MenuDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !dropdownRef.current?.contains(event.target as Node) &&
        !document.querySelector("#menu-icon")?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={sass.container}>
      <Menu onClick={() => setIsOpen(true)} />

      <ul className={isOpen ? sass.ulOpen : sass.ul} ref={dropdownRef}>
        <li onClick={() => signOut({ callbackUrl: "/" })}>Sign out</li>
      </ul>
    </div>
  );
}
