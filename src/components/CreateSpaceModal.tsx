'use client';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'; // make sure the path is correct
import { useState } from 'react';
import CreateSpaceForm from './CreateSpaceForm';

export default function CreateSpaceModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-blue-600 text- rounded hover:bg-blue-700">
          + Create Space
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Create Audio Space</DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-4">
          <CreateSpaceForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
