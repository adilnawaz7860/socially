import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client"; // <- Make sure you have this enum

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  const { title, description, invitedUserClerkIds } = body;

  try {
    // Get the user from DB
    const hostUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!hostUser) {
      return new NextResponse("User not found in DB", { status: 404 });
    }

    // Create the space
    const space = await prisma.space.create({
      data: {
        title,
        description,
        isPrivate: true,
        host: { connect: { id: hostUser.id } },
      },
    });

    // 1. Add host as participant with HOST role
    await prisma.spaceParticipant.create({
      data: {
        spaceId: space.id,
        userId: hostUser.id,
        role: Role.HOST,
      },
    });

    // 2. Invite the host (self-invite, optional)
    await prisma.invite.create({
      data: {
        spaceId: space.id,
        invitedId: hostUser.id,
        invitedById: hostUser.id,
      },
    });

    // 3. Invite others and optionally pre-add them as LISTENER
    if (invitedUserClerkIds?.length > 0) {
      for (const clerkId of invitedUserClerkIds) {
          console.log("Inviting user with clerkId:", clerkId);
        const invitedUser = await prisma.user.findUnique({
          where: { clerkId },
        });

        if (!invitedUser){
              console.log("User with clerkId not found in DB:", clerkId);

            continue;
        }
       

          console.log("Resolved to userId:", invitedUser.id);

        await prisma.invite.create({
          data: {
            spaceId: space.id,
            invitedId: invitedUser.id,
            invitedById: hostUser.id,
          },
        });

        // Optional: auto add as LISTENER
        await prisma.spaceParticipant.create({
          data: {
            spaceId: space.id,
            userId: invitedUser.id,
            role: Role.LISTENER,
          },
        });
      }
    }

    return NextResponse.json(space);
  } catch (err) {
    console.error(err);
     console.error("Space Creation Error:", err);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
