"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import React from "react";

import { MenuDropdown } from "@/app/_/components/MenuDropdown";
import { useHeaderDropdownStore } from "@/app/_/store";
import { ThemesBadge } from "@/app/(music)/settings/_/components";

import { useThemesContext } from "../../providers";
import styles from "./styles.module.scss";

export function HeaderMenu() {
  const { isHeaderDropdownOpen, setIsHeaderDropdownOpen } = useHeaderDropdownStore();
  const { themes, handleTheme } = useThemesContext();

  const renderThemeBadges = () => {
    return Object.entries(themes).map(([key, theme]) => {
      const { background, widgets, accent, text } = theme;
      return (
        <ThemesBadge
          key={key}
          bgColor={background}
          widgetColor={widgets}
          accentColor={accent}
          textColor={text}
          applyTheme={() => handleTheme(theme)}
          data-theme-badge
        />
      );
    });
  };

  const headerList = (className: string) => {
    return [
      {
        node: (
          <Link
            className={className}
            href={"/settings"}
            onClick={() => setIsHeaderDropdownOpen(false)}
          >
            Settings
          </Link>
        ),
      },
      {
        node: <div className={styles.themeBadgeContainer}>{renderThemeBadges()}</div>,
      },
      {
        node: (
          <Link
            className={className}
            href={"https://github.com/AlexanderKudr/tune"}
            onClick={() => setIsHeaderDropdownOpen(false)}
            target="_blank"
          >
            Know more...
          </Link>
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
      className={styles.userImage}
      width={0}
      height={0}
      unoptimized
    />
  ) : (
    <div className={styles.userFiller} />
  );
}
