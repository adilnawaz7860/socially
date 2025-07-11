'use client';

import { Role } from '@prisma/client';

export default function GiveMicButton({ spaceId, participant }: any) {
  const giveMic = async () => {
    await fetch('/api/space/role', {
      method: 'POST',
      body: JSON.stringify({
        spaceId,
        targetUserId: participant.identity,
        newRole: Role.COHOST, // or Role.SPEAKER if you differentiate
      }),
    });
  };

  return (
    <button onClick={giveMic} className="text-green-600">
      Give Mic
    </button>
  );
}
