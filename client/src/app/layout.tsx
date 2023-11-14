import type { Metadata } from "next";
import { Quicksand, Qwitcher_Grypen } from "next/font/google";

import { Header } from "@/shared/layouts";
import "@/shared/sass/main.scss";

const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" });
const qwitcher = Qwitcher_Grypen({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-qwitcher",
});

export const metadata: Metadata = {
  title: "Tune",
  description: "Music service",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${quicksand.className} ${qwitcher.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
