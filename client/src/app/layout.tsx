import "@/shared/sass/main.scss";

import type { Metadata } from "next";
import { Quicksand, Qwitcher_Grypen } from "next/font/google";
import { getServerSession, Session } from "next-auth";

import { Header } from "@/app/_/layouts";
import { SessionProvider } from "@/app/_/providers";
import { authOptions } from "@/shared/utils/functions";

import { PlayerProvider } from "./(music)/_/providers";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = (await getServerSession(authOptions)) as Session;
  return (
    <html lang="en">
      <body className={`${quicksand.className} ${qwitcher.variable}`}>
        <SessionProvider session={session}>
          <Header />
          <PlayerProvider>{children}</PlayerProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
