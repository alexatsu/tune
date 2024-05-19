/*
  Warnings:

  - You are about to drop the `Music` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Music" DROP CONSTRAINT "Music_userId_fkey";

-- DropTable
DROP TABLE "Music";

-- CreateTable
CREATE TABLE "songs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "urlId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
