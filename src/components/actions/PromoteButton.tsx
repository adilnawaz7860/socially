'use client';

import { Role } from '@prisma/client';

export default function PromoteButton({ spaceId, participant }: any) {
  const promote = async () => {
    await fetch('/api/space/role', {
      method: 'POST',
      body: JSON.stringify({
        spaceId,
        targetUserId: participant.identity,
        newRole: Role.COHOST,
      }),
    });
  };

  return (
    <button onClick={promote} className="text-yellow-600">
      Promote
    </button>
  );
}
