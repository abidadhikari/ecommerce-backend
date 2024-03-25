/*
  Warnings:

  - You are about to drop the column `LName` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `LName`,
    ADD COLUMN `lName` VARCHAR(191) NOT NULL DEFAULT '';
