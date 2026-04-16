/*
  Warnings:

  - You are about to drop the column `user_id` on the `todolist` table. All the data in the column will be lost.
  - Added the required column `owner_id` to the `todolist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "todolist" DROP CONSTRAINT "todolist_user_id_fkey";

-- AlterTable
ALTER TABLE "todolist" DROP COLUMN "user_id",
ADD COLUMN     "owner_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "todolist" ADD CONSTRAINT "todolist_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
