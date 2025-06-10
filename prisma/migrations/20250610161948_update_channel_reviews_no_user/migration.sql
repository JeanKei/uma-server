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

-- AddForeignKey
ALTER TABLE "channel_reviews" ADD CONSTRAINT "channel_reviews_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
