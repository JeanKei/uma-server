-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'PREMIUM', 'MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ChannelStatus" AS ENUM ('MODERATION', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "avatar_path" TEXT,
    "telegram_id" TEXT,
    "rights" "Role"[] DEFAULT ARRAY['USER']::"Role"[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telegram_channels" (
    "id" TEXT NOT NULL,
    "channel_url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "ChannelStatus" NOT NULL DEFAULT 'MODERATION',
    "is_actual" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "telegram_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parsing_public_stat" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "avatar" TEXT,
    "title" TEXT,
    "description" TEXT,
    "username" TEXT,
    "is_verified" BOOLEAN NOT NULL,
    "subscribers" TEXT,
    "photos" TEXT,
    "videos" TEXT,
    "files" TEXT,
    "links" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parsing_public_stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parsing_public_jobs" (
    "id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3),
    "parsed_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "parsing_public_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parsing_public_config" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "interval_seconds" INTEGER NOT NULL DEFAULT 60,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parsing_public_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderator_chat_sessions" (
    "moderatorId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "pendingRejection" TEXT,

    CONSTRAINT "moderator_chat_sessions_pkey" PRIMARY KEY ("moderatorId")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_id_key" ON "users"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "parsing_public_stat_channel_id_key" ON "parsing_public_stat"("channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- AddForeignKey
ALTER TABLE "telegram_channels" ADD CONSTRAINT "telegram_channels_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parsing_public_stat" ADD CONSTRAINT "parsing_public_stat_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "telegram_channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

