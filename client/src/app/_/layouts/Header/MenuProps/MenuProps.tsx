"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import React from "react";

import styles from "./styles.module.scss";

export function MenuProps() {
  const list = (className: string) => {
    return [
      {
        node: (
          <li className={className}>
            <Link href={"/settings"}>Settings</Link>
          </li>
        ),
      },
      {
        node: (
          <li className={className} onClick={() => signOut({ callbackUrl: "/" })}>
            Sign out
          </li>
        ),
      },
    ];
  };

  const menuProps = (
    <>
      {list(styles.menuPropsList).map((element, index) => (
        <React.Fragment key={crypto.randomUUID()}>{element.node}</React.Fragment>
      ))}
    </>
  );

  return menuProps;
}
