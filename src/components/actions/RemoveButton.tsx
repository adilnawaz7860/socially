'use client';

export default function RemoveButton({ spaceId, participant }: any) {
  const remove = async () => {
    await fetch('/api/space/remove', {
      method: 'POST',
      body: JSON.stringify({
        spaceId,
        targetUserId: participant.identity,
      }),
    });
  };

  return (
    <button onClick={remove} className="text-red-600">
      Remove
    </button>
  );
}
