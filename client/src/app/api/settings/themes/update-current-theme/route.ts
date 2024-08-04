import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";

import { Theme } from "@/app/_/providers/ThemesProvider";
import { db } from "@/app/api/_/services";

export async function PUT(req: NextRequest) {
  const { session, currentTheme }: { session: Session; currentTheme: Theme } = await req.json();

  if (!session) {
    return NextResponse.json({ user: null, message: "Session is required" }, { status: 404 });
  }

  const userEmail = session.user?.email || "";

  const user = await db.user.findUnique({
    where: { email: userEmail },
    include: { settings: { include: { themesSettings: { include: { currentTheme: true } } } } },
  });

  if (!user || !user.settings) {
    // If no Settings record exists, create a new one
    const theme = await db.user.update({
      where: { email: userEmail },
      data: {
        settings: {
          create: {
            themesSettings: {
              create: {
                currentTheme: {
                  create: {
                    background: currentTheme.background,
                    widgets: currentTheme.widgets,
                    accent: currentTheme.accent,
                    text: currentTheme.text,
                  },
                },
              },
            },
          },
        },
      },
    });

    await db.$disconnect();
    return NextResponse.json({ theme, message: "Theme created successfully" }, { status: 200 });
  } else {
    const existingTheme = user.settings.themesSettings.currentTheme;
    const updatedTheme = await db.currentTheme.update({
      where: { id: existingTheme.id },
      data: {
        background: currentTheme.background,
        widgets: currentTheme.widgets,
        accent: currentTheme.accent,
        text: currentTheme.text,
      },
    });

    await db.$disconnect();
    return NextResponse.json(
      { updatedTheme, message: "Theme updated successfully" },
      { status: 200 },
    );
  }
}
