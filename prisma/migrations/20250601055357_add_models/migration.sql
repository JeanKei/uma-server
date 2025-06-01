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
CREATE TABLE "stat_public" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "avatar" TEXT,
    "title" TEXT,
    "description" TEXT,
    "username" TEXT,
    "is_verified" BOOLEAN NOT NULL,
    "subscribers" INTEGER,
    "photos" INTEGER,
    "videos" INTEGER,
    "files" INTEGER,
    "links" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stat_public_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stat_public_job" (
    "id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "finished_at" TIMESTAMP(3),
    "parsed_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "stat_public_job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stat_public_config" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "interval_seconds" INTEGER NOT NULL DEFAULT 60,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stat_public_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stat_initial" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "subscribers" INTEGER,
    "gender" TEXT,
    "view" INTEGER,
    "er" DOUBLE PRECISION,
    "cpv" DOUBLE PRECISION,
    "price" INTEGER,
    "img_src" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stat_initial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories_channel" (
    "channelId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "categories_channel_pkey" PRIMARY KEY ("channelId","categoryId")
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
CREATE UNIQUE INDEX "channels_channel_url_key" ON "channels"("channel_url");

-- CreateIndex
CREATE UNIQUE INDEX "stat_public_channel_id_key" ON "stat_public"("channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "stat_initial_channel_id_key" ON "stat_initial"("channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stat_public" ADD CONSTRAINT "stat_public_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stat_initial" ADD CONSTRAINT "stat_initial_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories_channel" ADD CONSTRAINT "categories_channel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories_channel" ADD CONSTRAINT "categories_channel_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
