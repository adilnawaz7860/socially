import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

  const { spaceId, targetUserId: targetClerkId, newRole } = await req.json();

  // Validate role
  if (!["HOST", "COHOST", "LISTENER"].includes(newRole)) {
    return new NextResponse("Invalid role", { status: 400 });
  }

  const actor = await prisma.user.findUnique({ where: { clerkId } });
  if (!actor) return new NextResponse("User not found", { status: 404 });

  const actorParticipant = await prisma.spaceParticipant.findUnique({
    where: {
      spaceId_userId: {
        spaceId,
        userId: actor.id,
      },
    },
  });

  if (!actorParticipant || !(actorParticipant.role === Role.HOST || actorParticipant.role === Role.COHOST)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // ✅ Convert Clerk ID to DB ID
  const targetUser = await prisma.user.findUnique({
    where: { clerkId: targetClerkId },
  });

  if (!targetUser) {
    return new NextResponse("Target user not found", { status: 404 });
  }

  // ✅ Update their role
  await prisma.spaceParticipant.update({
    where: {
      spaceId_userId: {
        spaceId,
        userId: targetUser.id,
      },
    },
    data: {
      role: newRole as Role,
    },
  });

  return NextResponse.json({ ok: true });
}
