'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateSpaceForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [invitedUserClerkIds, setInvitedUserClerkIds] = useState<string[]>([]);
  const [newInvite, setNewInvite] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAddInvite = () => {
    if (newInvite && !invitedUserClerkIds.includes(newInvite)) {
      setInvitedUserClerkIds([...invitedUserClerkIds, newInvite]);
      setNewInvite('');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/space/create', {
      method: 'POST',
      body: JSON.stringify({ title, description, invitedUserClerkIds }),
    });

    if (res.ok) {
      const data = await res.json();
      const link = `${window.location.origin}/space/${data.id}`;

      await navigator.clipboard.writeText(link);

      // ✅ Clean up before navigating
      setTitle('');
      setDescription('');
      setInvitedUserClerkIds([]);
      setMessage('Space created! Redirecting...');
      setLoading(false);

      // ✅ Smoothly transition to the room
      startTransition(() => {
        router.push(`/space/${data.id}`);
      });
    } else {
      setMessage('Error creating space');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-xl bg-black shadow">
      <h2 className="text-2xl font-semibold mb-4">Create Audio Space</h2>

      <input
        type="text"
        placeholder="Space Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      <div className="mb-3">
        <label className="block mb-1">Invite by Clerk ID</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newInvite}
            onChange={(e) => setNewInvite(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="user_abc123"
          />
          <button
            onClick={handleAddInvite}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add
          </button>
        </div>

        <ul className="mt-2 text-sm text-gray-700">
          {invitedUserClerkIds.map((id) => (
            <li key={id}>• {id}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded"
      >
        {loading ? 'Creating...' : 'Create Space'}
      </button>

      {isPending && (
        <p className="mt-4 text-sm text-gray-600 text-center animate-pulse">
          Joining room...
        </p>
      )}

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
