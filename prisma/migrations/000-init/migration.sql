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
CREATE TABLE "channels" (
    "id" TEXT NOT NULL,
    "channel_url" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "avatar" TEXT,
    "user_id" TEXT,
    "status" "ChannelStatus" NOT NULL DEFAULT 'MODERATION',
    "is_actual" BOOLEAN NOT NULL DEFAULT false,
    "price" INTEGER,
    "format_24h" BOOLEAN NOT NULL DEFAULT true,
    "format_48h" BOOLEAN NOT NULL DEFAULT true,
    "format_72h" BOOLEAN NOT NULL DEFAULT true,
    "format_native" BOOLEAN NOT NULL DEFAULT true,
    "format_7d" BOOLEAN NOT NULL DEFAULT true,
    "format_repost" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_reviews" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "channel_id" TEXT NOT NULL,

    CONSTRAINT "channel_reviews_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "stats" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "subscribers" INTEGER,
    "photos" INTEGER,
    "videos" INTEGER,
    "files" INTEGER,
    "links" INTEGER,
    "gender" INTEGER DEFAULT 0,
    "view" INTEGER DEFAULT 0,
    "er" DOUBLE PRECISION DEFAULT 0,
    "cpv" DOUBLE PRECISION DEFAULT 0,
    "price" INTEGER DEFAULT 0,
    "img_src" TEXT DEFAULT 'channels-img/default.png',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "data_post" TEXT NOT NULL,
    "message_url" TEXT NOT NULL,
    "message_text" TEXT,
    "views" INTEGER DEFAULT 0,
    "datetime" TIMESTAMP(3),
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "videos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "seo_text" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories_channels" (
    "channelId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "categories_channels_pkey" PRIMARY KEY ("channelId","categoryId")
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

-- CreateTable
CREATE TABLE "channel_verification" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_id_key" ON "users"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "channels_channel_url_key" ON "channels"("channel_url");

-- CreateIndex
CREATE UNIQUE INDEX "stats_channel_id_key" ON "stats"("channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "posts_data_post_key" ON "posts"("data_post");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_reviews" ADD CONSTRAINT "channel_reviews_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stats" ADD CONSTRAINT "stats_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories_channels" ADD CONSTRAINT "categories_channels_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories_channels" ADD CONSTRAINT "categories_channels_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_verification" ADD CONSTRAINT "channel_verification_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_verification" ADD CONSTRAINT "channel_verification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

