-- CreateTable
CREATE TABLE "Labeler" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "primaryLanguage" TEXT,
    "englishProficiency" TEXT,
    "skills" TEXT[],
    "availableHours" TEXT,
    "preferredTime" TEXT,
    "education" TEXT,
    "experience" TEXT,
    "experienceDescription" TEXT,
    "deviceType" TEXT,
    "internetSpeed" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalEarned" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tasksCompleted" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Labeler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "labelerId" TEXT,
    "fileUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "result" JSONB,
    "paymentAmount" DOUBLE PRECISION,
    "paymentTxSignature" TEXT,
    "batchNumber" INTEGER,
    "taskData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Labeler_walletAddress_key" ON "Labeler"("walletAddress");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_labelerId_fkey" FOREIGN KEY ("labelerId") REFERENCES "Labeler"("id") ON DELETE SET NULL ON UPDATE CASCADE;
