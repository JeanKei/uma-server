-- CreateTable
CREATE TABLE "orders_channels" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "postText" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "totalSubscribers" INTEGER NOT NULL,
    "images" TEXT[],
    "publishDates" JSONB NOT NULL,
    "channels" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_channels_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders_channels" ADD CONSTRAINT "orders_channels_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
