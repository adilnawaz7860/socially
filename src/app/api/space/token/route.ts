import { auth } from "@clerk/nextjs/server";
import { createLiveKitToken } from "@/lib/livekit";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId: clerkId } = await  auth(); // no await needed
  if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

  const { spaceId } = await req.json();
  
  const user = await prisma.user.findUnique({ where: { clerkId } });
  
  if (!user) return new NextResponse("User not found", { status: 404 });

  const participant = await prisma.spaceParticipant.findUnique({
    where: {
      spaceId_userId: {
        spaceId,
        userId: user.id,
      },
    },
  });

  if (!participant) return new NextResponse("Forbidden", { status: 403 });

  const token = await createLiveKitToken(
    clerkId,               // identity
    spaceId,               // room
    participant.role,      // role for metadata
    user.name || user.username || clerkId  // participant name
  );

  console.log('Generated JWT:', token, typeof token); // ✅ should log "string"

  console.log(token , "token jiii")

  return NextResponse.json({
    token,
    url: process.env.LIVEKIT_URL,
  });
}
