/*
  Warnings:

  - Added the required column `duration` to the `AlbumSong` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `AlbumSong` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `AlbumSong` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urlId` to the `AlbumSong` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AlbumSong" ADD COLUMN     "cover" TEXT,
ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ADD COLUMN     "urlId" TEXT NOT NULL;
