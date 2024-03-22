/*
  Warnings:

  - You are about to drop the column `storage` on the `Song` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "storage",
ADD COLUMN     "cover" TEXT;
