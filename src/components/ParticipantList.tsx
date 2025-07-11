import { useParticipants } from '@livekit/components-react';
import ParticipantTile from './ParticipantPile';

export default function ParticipantList({ spaceId }: { spaceId: any }) {
  const participants = useParticipants();

  console.log(participants , "parrrrrrrrrrr")

  return (
    <div className="space-y-2">
      {participants.map((participant) => {
        const metadata = participant.metadata
          ? JSON.parse(participant.metadata)
          : { identity: participant.identity, role: 'LISTENER' };

        return (
          <ParticipantTile
            key={participant.identity}
            spaceId={spaceId} // ✅ pass it here
            participant={participant}
            metadata={metadata}
          />
        );
      })}
    </div>
  );
}
