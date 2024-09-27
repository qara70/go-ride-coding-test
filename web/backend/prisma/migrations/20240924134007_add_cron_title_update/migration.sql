-- CreateTable
CREATE TABLE "CronTitleUpdate" (
    "shop" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'STOPPED',
    "lastRun" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CronTitleUpdate_pkey" PRIMARY KEY ("shop")
);

-- CreateIndex
CREATE UNIQUE INDEX "CronTitleUpdate_shop_key" ON "CronTitleUpdate"("shop");

-- AddForeignKey
ALTER TABLE "CronTitleUpdate" ADD CONSTRAINT "CronTitleUpdate_shop_fkey" FOREIGN KEY ("shop") REFERENCES "Shop"("shop") ON DELETE CASCADE ON UPDATE CASCADE;
