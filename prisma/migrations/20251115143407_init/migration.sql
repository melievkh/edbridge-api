/*
  Warnings:

  - You are about to drop the column `referralCode` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "referralCode" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "referralCode";
