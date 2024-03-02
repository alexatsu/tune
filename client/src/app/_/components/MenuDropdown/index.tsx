"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./styles.module.scss";

type Props = { props: JSX.Element; Icon: React.ReactNode };

export function MenuDropdown({ props, Icon }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.container}>
      <div onClick={() => setIsOpen(!isOpen)}>{Icon}</div>
      <ul className={isOpen ? styles.ulOpen : styles.ul} ref={dropdownRef}>
        {props}
      </ul>
    </div>
  );
}
