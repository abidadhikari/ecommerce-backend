/*
  Warnings:

  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - Added the required column `LName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `name`,
    ADD COLUMN `LName` VARCHAR(191) NOT NULL,
    ADD COLUMN `fName` VARCHAR(191) NOT NULL,
    ADD COLUMN `mName` VARCHAR(191) NOT NULL;
