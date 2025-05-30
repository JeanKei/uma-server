/*
  Warnings:

  - A unique constraint covering the columns `[channel_url]` on the table `telegram_channels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "telegram_channels_channel_url_key" ON "telegram_channels"("channel_url");
