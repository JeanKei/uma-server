/*
  Warnings:

  - You are about to drop the `stat_public` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stat_public_config` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stat_public_job` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "stat_public" DROP CONSTRAINT "stat_public_channel_id_fkey";

-- DropTable
DROP TABLE "stat_public";

-- DropTable
DROP TABLE "stat_public_config";

-- DropTable
DROP TABLE "stat_public_job";

-- CreateTable
CREATE TABLE "stats_public" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "avatar" TEXT,
    "title" TEXT,
    "description" TEXT,
    "is_verified" BOOLEAN NOT NULL,
    "subscribers" INTEGER,
    "photos" INTEGER,
    "videos" INTEGER,
    "files" INTEGER,
    "links" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stats_public_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stats_public_job" (
    "id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3),
    "parsed_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "stats_public_job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stats_public_config" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "interval_seconds" INTEGER NOT NULL DEFAULT 60,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stats_public_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stats_public_channel_id_key" ON "stats_public"("channel_id");

-- AddForeignKey
ALTER TABLE "stats_public" ADD CONSTRAINT "stats_public_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
