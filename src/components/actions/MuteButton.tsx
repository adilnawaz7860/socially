'use client';

import { useContext } from 'react';
import { RoomContext } from '@livekit/components-react';
import type { Participant } from 'livekit-client';

type Props = {
  participant: Participant;
};

export default function MuteButton({ participant }: Props) {
  const room = useContext(RoomContext);

  const handleMute = () => {
    if (!room || !room.localParticipant) return;

    const payload = JSON.stringify({
      type: 'MUTE_REQUEST',
      target: participant.identity,
    });

    const encodedPayload = new TextEncoder().encode(payload);

    try {
      room.localParticipant.publishData(encodedPayload, {
        reliable: true,
      });
      console.log('Mute request sent:', payload);
    } catch (err) {
      console.error('Failed to send mute request:', err);
    }
  };

  return (
    <button
      className="text-blue-600 hover:underline"
      onClick={handleMute}
    >
      Mute
    </button>
  );
}
