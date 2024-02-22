"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { Menu } from "@/app/_/components/icons";
import styles from "./styles.module.scss";
import Link from "next/link";

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
    <div className={styles.container}>
      <Menu onClick={() => setIsOpen(true)} />

      <ul className={isOpen ? styles.ulOpen : styles.ul} ref={dropdownRef}>
        <li>
          <Link href={"/settings"}>Settings</Link>
        </li>
        <li onClick={() => signOut({ callbackUrl: "/" })}>Sign out</li>
      </ul>
    </div>
  );
}
