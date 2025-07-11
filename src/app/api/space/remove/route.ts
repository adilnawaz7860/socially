import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });
  const { spaceId, targetUserId } = await req.json();

  const actor = await prisma.user.findUnique({ where: { clerkId } });
  if (!actor) return new NextResponse("User not found", { status: 404 });

  const actorPart = await prisma.spaceParticipant.findUnique({
    where: { spaceId_userId: { spaceId, userId: actor.id } },
  });
  if (!actorPart || !(actorPart.role === Role.HOST || actorPart.role === Role.COHOST)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  await prisma.spaceParticipant.delete({
    where: { spaceId_userId: { spaceId, userId: targetUserId } },
  });

  return NextResponse.json({ ok: true });
}
