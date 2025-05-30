-- AlterTable
ALTER TABLE "telegram_channels" ADD COLUMN     "format_24h" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "format_48h" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "format_72h" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "format_7d" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "format_native" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "format_repost" BOOLEAN NOT NULL DEFAULT true;
