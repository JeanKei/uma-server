/*
  Warnings:

  - The `subscribers` column on the `parsing_public_stat` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `photos` column on the `parsing_public_stat` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `videos` column on the `parsing_public_stat` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `files` column on the `parsing_public_stat` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `links` column on the `parsing_public_stat` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "parsing_public_stat" DROP COLUMN "subscribers",
ADD COLUMN     "subscribers" INTEGER,
DROP COLUMN "photos",
ADD COLUMN     "photos" INTEGER,
DROP COLUMN "videos",
ADD COLUMN     "videos" INTEGER,
DROP COLUMN "files",
ADD COLUMN     "files" INTEGER,
DROP COLUMN "links",
ADD COLUMN     "links" INTEGER;
