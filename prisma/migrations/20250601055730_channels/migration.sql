/*
  Warnings:

  - You are about to drop the `categories_channel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "categories_channel" DROP CONSTRAINT "categories_channel_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "categories_channel" DROP CONSTRAINT "categories_channel_channelId_fkey";

-- DropTable
DROP TABLE "categories_channel";

-- CreateTable
CREATE TABLE "categories_channels" (
    "channelId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "categories_channels_pkey" PRIMARY KEY ("channelId","categoryId")
);

-- AddForeignKey
ALTER TABLE "categories_channels" ADD CONSTRAINT "categories_channels_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories_channels" ADD CONSTRAINT "categories_channels_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
