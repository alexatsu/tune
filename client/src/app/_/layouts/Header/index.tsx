"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import React from "react";

import { Menu } from "@/app/_/components/icons";
import { MenuDropdown } from "@/app/_/components/MenuDropdown";
import { useHeaderDropdownStore } from "@/shared/store";

import styles from "./styles.module.scss";

export function Header() {
  const { isHeaderDropdownOpen, setIsHeaderDropdownOpen } = useHeaderDropdownStore();

  const headerList = (className: string) => {
    return [
      {
        node: (
          <li className={className}>
            <Link href={"/settings"} onClick={() => setIsHeaderDropdownOpen(false)}>
              Settings
            </Link>
          </li>
        ),
      },
      {
        node: (
          <li
            className={className}
            onClick={() => {
              signOut({ callbackUrl: "/" });
              setIsHeaderDropdownOpen(false);
            }}
          >
            Sign out
          </li>
        ),
      },
    ];
  };

  const headerMenuProps = (
    <>
      {headerList(styles.menuPropsList).map((element, index) => (
        <React.Fragment key={crypto.randomUUID()}>{element.node}</React.Fragment>
      ))}
    </>
  );

  return (
    <header className={styles.header}>
      <Link href={"/"} className={styles.logo}>
        <h1>Tune</h1>
      </Link>

      <MenuDropdown
        props={headerMenuProps}
        Icon={<Menu />}
        isOpen={isHeaderDropdownOpen}
        setIsOpen={setIsHeaderDropdownOpen}
      />
    </header>
  );
}
