-- CreateEnum
CREATE TYPE "Role" AS ENUM ('HOST', 'COHOST', 'LISTENER');

-- DropIndex
DROP INDEX "Space_hostId_idx";

-- CreateTable
CREATE TABLE "SpaceParticipant" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'LISTENER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpaceParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpaceParticipant_spaceId_userId_key" ON "SpaceParticipant"("spaceId", "userId");

-- AddForeignKey
ALTER TABLE "SpaceParticipant" ADD CONSTRAINT "SpaceParticipant_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceParticipant" ADD CONSTRAINT "SpaceParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
