"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import React from "react";

import { Menu } from "@/app/_/components/icons";
import { MenuDropdown } from "@/app/_/components/MenuDropdown";
import { useHeaderDropdownStore } from "@/app/_/store";

import styles from "./styles.module.scss";

export function HeaderMenu() {
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
            style={{ color: "#faa0a0" }}
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
      <MenuDropdown
        props={headerMenuProps}
        Icon={<UserImage />}
        isOpen={isHeaderDropdownOpen}
        setIsOpen={setIsHeaderDropdownOpen}
        isHeader={true}
      />
    </header>
  );
}

function UserImage() {
  const { data: session } = useSession();
  const userImage = session?.user?.image;
  return userImage ? (
    <Image
      src={userImage as string}
      alt="user-image"
      height={40}
      width={40}
      className={styles.userImage}
    />
  ) : (
    <div className={styles.userFiller} />
  );
}
