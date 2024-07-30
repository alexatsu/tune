"use client";

import { useEffect, useRef } from "react";
import React from "react";

import { useMobile } from "@/app/(music)/_/hooks";

import styles from "./styles.module.scss";

type Props = {
  props: JSX.Element;
  Icon: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isHeader?: boolean;
};

export function MenuDropdown({ props, Icon, isOpen, setIsOpen, isHeader }: Props) {
  const dropdownRef = useRef<HTMLUListElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile(576);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isOpen &&
        !dropdownRef.current?.contains(target) &&
        !menuRef.current?.contains(target) &&
        !target.closest("[data-theme-badge]")
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

    if (isHeader) {
      dropdownRef.current?.style.setProperty("top", "calc(100% + 5px)");
      dropdownRef.current?.style.setProperty(isMobile ? "right" : "left", "0px");
    } else {
      if (viewHeight / 2 > top) {
        dropdownRef.current?.style.setProperty("top", "35px");
      } else {
        dropdownRef.current?.style.setProperty("bottom", "calc(100% + 10px)");
      }
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
