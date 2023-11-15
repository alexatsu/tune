import type { Metadata } from "next";
import { Quicksand, Qwitcher_Grypen } from "next/font/google";
import { getServerSession } from "next-auth";

import { Header } from "@/shared/layouts";
import { SessionProvider, NavMenu } from "@/shared/services/auth";
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={`${quicksand.className} ${qwitcher.variable}`}>
        <SessionProvider session={session}>
          {/* <Header />
          {children} */}
          <NavMenu />
        </SessionProvider>
      </body>
    </html>
  );
}
