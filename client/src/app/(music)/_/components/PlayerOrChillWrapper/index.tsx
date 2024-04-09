"use client";

import { usePathname } from "next/navigation";

import { ChillStreamer, Player } from "../../layouts";

export function PlayerOrChillWrapper() {
  const pathname = usePathname();
  return pathname === "/chill" ? <ChillStreamer /> : <Player />;
}
