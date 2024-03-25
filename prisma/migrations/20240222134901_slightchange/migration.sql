/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_age_name_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `isAdmin`,
    MODIFY `role` ENUM('BASIC', 'ADMIN', 'SUPERADMIN') NOT NULL DEFAULT 'BASIC';
