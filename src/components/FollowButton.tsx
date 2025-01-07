"use client"
import React, { useState } from 'react'
import { Button } from './ui/button';
import { Loader2Icon } from 'lucide-react';
import { toggleFollow } from '@/actions/user.action';
import { toast } from 'react-toastify';

const FollowButton = ({ userId }: { userId: string }) => {
    const [isLoading ,setIsLoading] = useState(false);

    const handleFollow = async () => {
        setIsLoading(true);
        try {
            await toggleFollow(userId)
            toast.success("User followed successfully")
            
        } catch (error) {
            console.error("Error  following user" , error)
            toast.error("Error following user")
            
        }

    }
  return (
    <Button disabled={isLoading} className='w-20' onClick={handleFollow} size={'sm'} variant={'secondary'}>
        {
            isLoading ? <Loader2Icon className='size-4 animate-spin'/> : "Follow"
        }
    </Button>
  )
}

export default FollowButton