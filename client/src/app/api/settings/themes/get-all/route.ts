import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";

import { db } from "@/api/_/services";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { session }: { session: Session } = await req.json();

  if (!session) {
    return NextResponse.json({ user: null, message: "Session is required" }, { status: 404 });
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

  return NextResponse.json({ themes: userThemes?.settings?.themesSettings }, { status: 200 });
}
