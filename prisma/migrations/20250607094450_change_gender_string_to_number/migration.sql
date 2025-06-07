/*
  Warnings:

  - The `gender` column on the `stat_initial` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "stat_initial" DROP COLUMN "gender",
ADD COLUMN     "gender" INTEGER;
