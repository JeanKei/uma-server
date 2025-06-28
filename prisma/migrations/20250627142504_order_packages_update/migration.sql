/*
  Warnings:

  - You are about to drop the column `price_year` on the `orders_packages` table. All the data in the column will be lost.
  - Added the required column `subtitle` to the `orders_packages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders_packages" DROP COLUMN "price_year",
ADD COLUMN     "subtitle" TEXT NOT NULL;
