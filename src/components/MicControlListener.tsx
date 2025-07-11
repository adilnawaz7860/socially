'use client';

import { useEffect, useContext } from 'react';
import { RoomContext } from '@livekit/components-react';

export default function MicControlListener() {
  const room = useContext(RoomContext);

  useEffect(() => {
    if (!room) return;

    const handleData = (payload: Uint8Array) => {
      const text = new TextDecoder().decode(payload);
      try {
        const data = JSON.parse(text);
        if (data.type === 'MUTE_REQUEST') {
          room.localParticipant.setMicrophoneEnabled(false); // 🔇 Mute mic
            alert("You were muted by the host.");

         }
      } catch (err) {
        console.error("Failed to parse incoming mute request:", err);
      }
    };

    room.on('dataReceived', handleData);
    return () => {
      room.off('dataReceived', handleData);
    };
  }, [room]);

  return null;
}