import "./_/sass/main.scss";

import type { Metadata } from "next";
import { Quicksand, Qwitcher_Grypen } from "next/font/google";
import { getServerSession, Session } from "next-auth";

import { PlayerProvider, SessionProvider, ThemesProvider } from "@/app/_/providers";
import { authOptions, handleFetch } from "@/app/_/utils/functions";

import { LoadProvider } from "./_/providers/LoadProvider";
import { ThemesResponse } from "./_/providers/ThemesProvider";

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

const getThemesSettings = async (session: Session) => {
  const response = await handleFetch<ThemesResponse>(
    process.env.NEXTAUTH_URL + "/api/settings/themes/get-all",
    "POST",
    { session },
  );
  console.log(response, "response");
  return response;
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = (await getServerSession(authOptions)) as Session;
  const themes = await getThemesSettings(session);

  return (
    <html lang="en">
      <body className={`${quicksand.className} ${qwitcher.variable}`}>
        <SessionProvider session={session}>
          <LoadProvider>
            <ThemesProvider themesFromDB={themes}>
              <PlayerProvider>{children}</PlayerProvider>
            </ThemesProvider>
          </LoadProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
