"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use useRouter for navigation in Next.js
import queryString from "query-string";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const CallbackHandler = () => {
  const CLIENT_ID = "c66b4b4a7b5a4e7cadd8df8f45a71c80"; // Replace with your Spotify client ID
  const CLIENT_SECRET = "3f26b74706504d8da9c54bc9bee32f87"; // Replace with your Spotify client secret
  const REDIRECT_URI = "http://localhost:3000/callback"; // Replace with your redirect URI
  const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
  const user:any = useUser();



  const router = useRouter(); // Use useRouter for navigation in Next.js

  useEffect(() => {
    const fetchAccessToken = async () => {
      const { code } = queryString.parse(window.location.search);
      if (!code) return;

      try {
        const response = await axios.post(
            TOKEN_ENDPOINT,
            queryString.stringify({
              grant_type: "authorization_code",
              code: code,
              redirect_uri: REDIRECT_URI,
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              withCredentials: true,  // Ensure credentials (cookies) are included in the request
            }
          );
          

        const { access_token } = response.data;
        localStorage.setItem("spotify_access_token", access_token); // Save the access token
        router.push(`/profile/${user?.username}`); // Redirect to the activity page
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    fetchAccessToken();
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 text-white">
      <p className="text-xl">Authenticating with Spotify...</p>
    </div>
  );
};

export default CallbackHandler;
