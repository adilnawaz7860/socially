import { AccessToken } from 'livekit-server-sdk';

export async function createLiveKitToken(
  identity: string,
  room: string,
  role: 'HOST' | 'COHOST' | 'LISTENER',
  name: string
) {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    {
      identity,
      name, // This sets participant.name
    }
  );

  at.metadata = JSON.stringify({ identity, role });

  at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

  return await  at.toJwt();
}
