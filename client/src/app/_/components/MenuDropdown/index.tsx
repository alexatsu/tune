"use client";

import { useEffect, useRef, useState } from "react";
import React from "react";

import styles from "./styles.module.scss";

type Props = { props: JSX.Element; Icon: React.ReactNode };

export function MenuDropdown({ props, Icon }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);

    const { top } = menuRef.current?.getBoundingClientRect() as DOMRect;
    const viewHeight = window.innerHeight;

    if (viewHeight / 2 > top) {
      dropdownRef.current?.style.setProperty("top", "35px");
    } else {
      dropdownRef.current?.style.setProperty("bottom", "calc(100% + 10px)");
    }
  };

  const closeDropdown = () => setIsOpen(false);

  return (
    <div className={styles.container}>
      <div onClick={toggleDropdown}>
        <div ref={menuRef}>{Icon}</div>
      </div>

      <ul className={isOpen ? styles.ulOpen : styles.ul} ref={dropdownRef}>
        <div onClick={closeDropdown}>{props}</div>
      </ul>
    </div>
  );
}
