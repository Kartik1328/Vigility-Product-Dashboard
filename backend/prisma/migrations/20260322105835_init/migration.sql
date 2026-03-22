-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureClick" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "featureName" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeatureClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "FeatureClick_featureName_idx" ON "FeatureClick"("featureName");

-- CreateIndex
CREATE INDEX "FeatureClick_timestamp_idx" ON "FeatureClick"("timestamp");

-- CreateIndex
CREATE INDEX "FeatureClick_userId_idx" ON "FeatureClick"("userId");

-- AddForeignKey
ALTER TABLE "FeatureClick" ADD CONSTRAINT "FeatureClick_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
