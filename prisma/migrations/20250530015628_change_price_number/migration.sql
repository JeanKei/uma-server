/*
  Warnings:

  - The `price` column on the `telegram_channels` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "telegram_channels" DROP COLUMN "price",
ADD COLUMN     "price" INTEGER;
