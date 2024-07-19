import "./_/sass/main.scss";

import type { Metadata } from "next";
import { Quicksand, Qwitcher_Grypen } from "next/font/google";
import { getServerSession, Session } from "next-auth";

import { PlayerProvider, SessionProvider } from "@/app/_/providers";
import { authOptions } from "@/app/_/utils/functions";

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
          <PlayerProvider>{children}</PlayerProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
