-- CreateTable
CREATE TABLE "AskUser" (
    "did" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "handle" TEXT NOT NULL,

    CONSTRAINT "AskUser_pkey" PRIMARY KEY ("did")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "toDid" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AskUser_handle_key" ON "AskUser"("handle");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_toDid_fkey" FOREIGN KEY ("toDid") REFERENCES "AskUser"("did") ON DELETE RESTRICT ON UPDATE CASCADE;
