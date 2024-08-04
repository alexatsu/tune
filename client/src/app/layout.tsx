import "./_/sass/main.scss";

import type { Metadata } from "next";
import { Quicksand, Qwitcher_Grypen } from "next/font/google";
import { getServerSession, Session } from "next-auth";

import { LoadProvider, PlayerProvider, SessionProvider, ThemesProvider } from "@/app/_/providers";
import { authOptions } from "@/app/_/utils/functions";

import { db } from "./api/_/services";

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

export type Theme = {
  background: string;
  widgets: string;
  accent: string;
  text: string;
};

export type ThemesResponse = {
  themes: {
    currentTheme: Theme;
    customThemes: Theme[];
    quickAccessThemes: Theme[];
  };
  message: string;
};

const getThemesSettings = async (session: Session) => {
  if (!session) {
    return {
      themes: null,
      message: "Session is required",
    };
  }
  const userEmail = session.user?.email || "";
  const userThemes = await db.user.findUnique({
    where: { email: userEmail },
    select: {
      settings: {
        select: {
          themesSettings: {
            select: {
              currentTheme: true,
              customThemes: true,
              quickAccessThemes: true,
            },
          },
        },
      },
    },
  });

  await db.$disconnect();

  return {
    themes: userThemes?.settings?.themesSettings,
    message: "success fetching themes",
  };
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = (await getServerSession(authOptions)) as Session;
  const themes = await getThemesSettings(session);

  return (
    <html lang="en">
      <body className={`${quicksand.className} ${qwitcher.variable}`}>
        <SessionProvider session={session}>
          <LoadProvider>
            <ThemesProvider themesFromDB={themes as ThemesResponse}>
              <PlayerProvider>{children}</PlayerProvider>
            </ThemesProvider>
          </LoadProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
