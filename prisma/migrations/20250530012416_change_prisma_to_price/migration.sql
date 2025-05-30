/*
  Warnings:

  - You are about to drop the column `prisma` on the `telegram_channels` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "telegram_channels" DROP COLUMN "prisma",
ADD COLUMN     "price" TEXT;
