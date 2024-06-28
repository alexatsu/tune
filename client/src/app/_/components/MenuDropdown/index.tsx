"use client";

import { useEffect, useRef } from "react";
import React from "react";

import styles from "./styles.module.scss";

type Props = {
  props: JSX.Element;
  Icon: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export function MenuDropdown({ props, Icon, isOpen, setIsOpen }: Props) {
  const dropdownRef = useRef<HTMLUListElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        !dropdownRef.current?.contains(event.target as Node) &&
        !menuRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, setIsOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);

    const { top } = menuRef.current?.getBoundingClientRect() as DOMRect;
    const viewHeight = window.innerHeight;

    if (viewHeight / 2 > top) {
      dropdownRef.current?.style.setProperty("top", "35px");
    } else {
      dropdownRef.current?.style.setProperty("bottom", "calc(100% + 10px)");
    }
  };

  return (
    <div className={styles.container}>
      <div onClick={toggleDropdown}>
        <div style={{ display: "flex", alignItems: "center" }} ref={menuRef}>
          {Icon}
        </div>
      </div>

      <ul className={isOpen ? styles.ulOpen : styles.ul} ref={dropdownRef}>
        {props}
      </ul>
    </div>
  );
}
