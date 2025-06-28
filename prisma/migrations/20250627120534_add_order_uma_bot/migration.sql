-- CreateTable
CREATE TABLE "orders_uma_bot" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "price_year" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_uma_bot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders_uma_bot" ADD CONSTRAINT "orders_uma_bot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
