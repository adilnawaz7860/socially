'use client';

import { useContext } from 'react';
import { RoomContext } from '@livekit/components-react';
import type { Participant } from 'livekit-client';
import { Role } from '@prisma/client';
import MuteButton from './actions/MuteButton';
import RemoveButton from './actions/RemoveButton';
import PromoteButton from './actions/PromoteButton';
import GiveMicButton from './actions/GiveMicButton';

type Props = {
  spaceId: string;
  participant: Participant;
  metadata: {
    identity: string;
    role: Role;
  };
};

export default function ParticipantTile({ spaceId, participant, metadata }: Props) {
  const room = useContext(RoomContext);
  const localMeta = room?.localParticipant?.metadata
    ? JSON.parse(room.localParticipant.metadata)
    : null;

  const myRole = localMeta?.role as Role;
  const isHostOrCohost = myRole === 'HOST' || myRole === 'COHOST';
  const isSelf = metadata.identity === room?.localParticipant.identity;

  return (
    <div className="flex justify-between items-center p-2 border rounded mb-2">
      <div>
        {participant.name}
        {metadata.role === 'HOST' && <span> 🎙️ Admin</span>}
        {metadata.role === 'COHOST' && <span> 🛠️ Co-Admin</span>}
      </div>

      {isHostOrCohost && !isSelf && (
        <div className="space-x-2">
          <MuteButton participant={participant} />
          <RemoveButton spaceId={spaceId} participant={participant} />
          {metadata.role === 'LISTENER' && (
            <>
              <GiveMicButton spaceId={spaceId} participant={participant} />
              <PromoteButton spaceId={spaceId} participant={participant} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
