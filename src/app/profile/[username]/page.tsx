import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from '@/actions/profile.action'
import React from 'react'
import ProfilePageClient from '../ProfilePageClient';
import Notfound from '../not-found';

export async  function generateMetadata({params} : {params : {username : string}}){
    const user = await getProfileByUsername(params.username);
    if(!user) return

    return {
        title : `${user.name ?? user.username}`,
        description : user.bio || `Checkout  ${user.username}'s profile`,
    }
}

const ProfilePageServer = async ({params} : {params : {username : string}}) => {
    const user = await getProfileByUsername(params.username);
    if (!user) return <Notfound/>;

    const [posts , likedPosts , isCurrentUserFollowing] = await Promise.all([
        getUserPosts(user.id),
        getUserLikedPosts(user.id),
        isFollowing(user.id)
    ])
  return <ProfilePageClient user={user} posts={posts} isFollowing={isCurrentUserFollowing} likedPosts={likedPosts}/>
}

export default ProfilePageServer