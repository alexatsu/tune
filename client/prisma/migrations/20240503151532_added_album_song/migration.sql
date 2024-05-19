/*
  Warnings:

  - You are about to drop the column `albumId` on the `Song` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_albumId_fkey";

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "albumId";

-- CreateTable
CREATE TABLE "AlbumSong" (
    "albumId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,

    CONSTRAINT "AlbumSong_pkey" PRIMARY KEY ("albumId","songId")
);

-- AddForeignKey
ALTER TABLE "AlbumSong" ADD CONSTRAINT "AlbumSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumSong" ADD CONSTRAINT "AlbumSong_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
