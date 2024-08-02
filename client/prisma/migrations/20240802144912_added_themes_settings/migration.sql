/*
  Warnings:

  - A unique constraint covering the columns `[settingsId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "settingsId" TEXT;

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "themesSettingsId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThemesSettings" (
    "id" TEXT NOT NULL,
    "currentThemeId" TEXT NOT NULL,
    "settingsId" TEXT,

    CONSTRAINT "ThemesSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentTheme" (
    "id" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "widgets" TEXT NOT NULL,
    "accent" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "themesSettingsId" TEXT,

    CONSTRAINT "CurrentTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuickAccessThemes" (
    "id" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "widgets" TEXT NOT NULL,
    "accent" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "themesSettingsId" TEXT,

    CONSTRAINT "QuickAccessThemes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomThemes" (
    "id" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "widgets" TEXT NOT NULL,
    "accent" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "themesSettingsId" TEXT,

    CONSTRAINT "CustomThemes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_themesSettingsId_key" ON "Settings"("themesSettingsId");

-- CreateIndex
CREATE UNIQUE INDEX "ThemesSettings_currentThemeId_key" ON "ThemesSettings"("currentThemeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_settingsId_key" ON "User"("settingsId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "Settings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_themesSettingsId_fkey" FOREIGN KEY ("themesSettingsId") REFERENCES "ThemesSettings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThemesSettings" ADD CONSTRAINT "ThemesSettings_currentThemeId_fkey" FOREIGN KEY ("currentThemeId") REFERENCES "CurrentTheme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuickAccessThemes" ADD CONSTRAINT "QuickAccessThemes_themesSettingsId_fkey" FOREIGN KEY ("themesSettingsId") REFERENCES "ThemesSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomThemes" ADD CONSTRAINT "CustomThemes_themesSettingsId_fkey" FOREIGN KEY ("themesSettingsId") REFERENCES "ThemesSettings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
