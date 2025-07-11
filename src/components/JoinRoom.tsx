'use client';

import {
  LiveKitRoom,
  useParticipants,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';
import ParticipantList from './ParticipantList';
import MicControlListener from './MicControlListener'; // ✅ import the listener

export default function JoinRoom({ spaceId }: { spaceId: any }) {
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const join = async () => {
      const res = await fetch('/api/space/token', {
        method: 'POST',
        body: JSON.stringify({ spaceId }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(typeof data.token, data.token);
        console.log(data.token , "datatatattoken")
        setToken(data.token);
        setServerUrl(data.url);
      } else {
        setError('You are not invited to this space.');
      }
    };

    join();
  }, [spaceId]);

  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!token) return <div className="text-center mt-10">Joining room...</div>;

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect
      data-lk-theme="default"
    >
      {/* ✅ Real-time mic control handler */}
      <MicControlListener />

      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          🗣️ Audio Space Room
        </h2>

        {/* ✅ Participant list with space ID */}
        <ParticipantList spaceId={spaceId} />
      </div>
    </LiveKitRoom>
  );
}
