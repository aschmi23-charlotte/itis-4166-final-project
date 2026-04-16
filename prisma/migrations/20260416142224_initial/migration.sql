-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "todolist" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "todolist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "todolistitem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "details" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "list_id" INTEGER NOT NULL,

    CONSTRAINT "todolistitem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "todolistnote" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "list_id" INTEGER NOT NULL,

    CONSTRAINT "todolistnote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "todolist" ADD CONSTRAINT "todolist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todolistitem" ADD CONSTRAINT "todolistitem_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "todolist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todolistnote" ADD CONSTRAINT "todolistnote_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "todolist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
