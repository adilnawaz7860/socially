"use client";
import React from "react";
import queryString from "query-string";

const CLIENT_ID = "c66b4b4a7b5a4e7cadd8df8f45a71c80"; // Replace with your Spotify client ID
const REDIRECT_URI = "http://localhost:3000/callback"; // Replace with your redirect URI
const SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
];

const getSpotifyAuthURL = () => {
  const authURL = queryString.stringify(
    {
      client_id: CLIENT_ID,
      response_type: "code",
      redirect_uri: REDIRECT_URI,
      scope: SCOPES.join(" "),
      prompt: "login",
    },
    { encode: false } // Prevent double encoding
  );
  return `https://accounts.spotify.com/authorize?${authURL}`;
};

const SpotifyLogin = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Login with Spotify</h1>
        <a
          href={getSpotifyAuthURL()}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Login to Spotify
        </a>
      </div>
    </div>
  );
};

export default SpotifyLogin;
