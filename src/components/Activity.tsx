"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import queryString from "query-string"; // Ensure this is imported for the refresh token logic
import Image from "next/image";

const CLIENT_ID = "c0f44e510ee5477e83db5101da44c3af"; // Replace with your Spotify client ID
const CLIENT_SECRET = "433f62ddb509440094b53a7bc64cc3ba"; // Replace with your Spotify client secret

const SpotifyActivity = () => {
  const [activity, setActivity] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [currentProgress, setCurrentProgress] = useState<any>(0);

//   useEffect(() => {
//     const fetchData = async () => {
//       let accessToken = localStorage.getItem("spotify_access_token");

//       if (!accessToken) {
//         setError("No access token found. Please log in again.");
//         return;
//       }

//       try {
//         const response = await axios.get(
//           "https://api.spotify.com/v1/me/player/currently-playing",
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//           }
//         );

//         setActivity(response.data);
//       } catch (error) {
//         console.error(error);
//         if (error.response && error.response.status === 401) {
//           // Token expired, refresh it
//           accessToken = await refreshAccessToken(); // Call refresh function
//           if (accessToken) {
//             // Retry the API request with the new access token
//             const retryResponse = await axios.get(
//               "https://api.spotify.com/v1/me/player/currently-playing",
//               {
//                 headers: {
//                   Authorization: `Bearer ${accessToken}`,
//                 },
//               }
//             );
//             setActivity(retryResponse.data);
//           } else {
//             setError("Failed to refresh access token. Please log in again.");
//           }
//         } else {
//           setError("Error fetching listening activity.");
//         }
//       }
//     };

//     fetchData();
//   }, []);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("spotify_refresh_token");
    if (!refreshToken) {
      setError("No refresh token found.");
      return null;
    }

    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        queryString.stringify({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const { access_token } = response.data;
      localStorage.setItem("spotify_access_token", access_token);
      return access_token;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return null;
    }
  };

  const formatDuration = (duration_ms:any) => {
    const minutes = Math.floor(duration_ms / 60000);
    const seconds = Math.floor((duration_ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    let interval;
  
    const fetchData = async () => {
      let accessToken = localStorage.getItem("spotify_access_token");
  
      if (!accessToken) {
        setError("No access token found. Please log in again.");
        return;
      }
  
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/player/currently-playing",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setActivity(response.data);
      } catch (error:any) {
        console.error(error);
        if (error.response && error.response.status === 401) {
          // Refresh the token if expired
          accessToken = await refreshAccessToken();
          if (accessToken) {
            const retryResponse = await axios.get(
              "https://api.spotify.com/v1/me/player/currently-playing",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            setActivity(retryResponse.data);
          } else {
            setError("Failed to refresh access token. Please log in again.");
          }
        } else {
          setError("Error fetching listening activity.");
        }
      }
    };
  
    fetchData(); // Initial fetch
  
    // Set up polling every 5 seconds
    interval = setInterval(() => {
      fetchData();
    }, 5000);
  
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);
  

  useEffect(() => {
    let interval:any;

    // If the song is playing, update the progress
    if (activity) {
      setCurrentProgress(activity.progress_ms); // Initialize progress based on the current state of activity

      interval = setInterval(() => {
        if (activity?.progress_ms !== undefined && activity?.item?.duration_ms) {
          setCurrentProgress((prevProgress:any) => {
            // If the song is still playing, continue updating progress
            if (prevProgress < activity.item.duration_ms) {
              return prevProgress + 1000; // Increment by 1 second
            } else {
              clearInterval(interval); // Stop the interval if song ends
              return activity.item.duration_ms; // Ensure it doesn't exceed the total duration
            }
          });
        }
      }, 1000); // Update every second
    }

    // Cleanup interval on component unmount or when activity changes
    return () => clearInterval(interval);

  }, [activity]); // Dependency on activity so that it resets when activity changes

  const currentProgressFormatted = formatDuration(currentProgress);
  const [sliderValue, setSliderValue] = useState(0);
  const totalDurationFormatted = formatDuration(activity?.item?.duration_ms);
  const handleSliderChange = (event:any) => {
    const newValue = Number(event.target.value);
    setSliderValue(newValue);
    console.log("Seeking to:", newValue);
    // Add seek functionality here if necessary
  };

  const clearAppCookiesAndStorage = () => {
    // Clear cookies from your app's domain
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Clear all localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
  
    // Optionally, you can also clear cookies from other domains (like spotify.com)
    const cookiesToClear = [
      "__Host-device_id",
      "__Host-sp_csrf_sid",
      "__Secure-TPASESSION",
      "inapptestgroup",
      "remember",
      "sp_dc",
      "sp_key",
      "sp_sso_csrf_token",
      "sp_t",
      "sp_tr"
    ];
  
    cookiesToClear.forEach(cookie => {
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.spotify.com;`;
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=accounts.spotify.com;`;
    });
  };
  
  const clearSpotifyCookies = () => {
    const cookiesToClear = [
      "sp_dc", "sp_key", "__Secure-TPASESSION", "remember"
    ];
    
    cookiesToClear.forEach(cookie => {
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.spotify.com;`;
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=accounts.spotify.com;`;
    });
  };
  
  
  function logout() {
   
    localStorage.clear();
   
  
    
  
  
    // Optionally, revoke the token
    const accessToken = sessionStorage.getItem('accessToken'); // or localStorage
    if (accessToken) {
      fetch('https://accounts.spotify.com/api/token/revoke', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'token': accessToken
        })
      }).then(response => {
        console.log('Token revoked');
      });
    }
  
    // Redirect to login with the prompt=login query parameter
  
    window.location.href = "/";
  }
   console.log(activity);

  return (
    <div className="flex w-full    p-2 gap-4">
      {error && <p className="text-red-500">{error}</p>}

      {activity ? (<>
        <div className="flex  border border-black w-full text-black rounded-md p-2 space-y-2 flex-col gap-2  items-center">
            <p style={{letterSpacing :"0.0.5rem"}} className="text-gray-800 text-lg font-medium leading-3"> Listening To Spotify</p>
         <div className="flex justify-start gap-6 px-5  items-start  w-full">
         
          <img  className="rounded-full border size-20 border-white"  src={activity?.item?.album?.images[0].url} alt="url"/>
          <div className="">
          <p className=" text-xl text-black">{activity.item.name}</p>
          <p> {activity.item.artists[0].name}</p>
          <p> {activity.item.album.name}</p>
          </div>
          </div>
          <input
  type="range"
  min="0"
  max={activity?.item?.duration_ms || 0} // Use the raw duration in milliseconds
  value={currentProgress} // Use the raw progress in milliseconds
  onChange={handleSliderChange}
  className="w-full mt-2"
/>
      <div className="flex w-full text-sm justify-between items-center">
        <p>{currentProgressFormatted}</p>
        <p>{totalDurationFormatted}</p>

      </div>
    

        </div>
    {/* <div>
        {
            activity?.item?.album?.images?.map((image , idx) => {
                return (
                    <Image width={200} height={200} key={idx} src={image.url} alt="url"/>
                )
            })
        }
        </div> */}
        </>
      ) : (
        <p>No activity or user not logged in.</p>
      )}

      {/* <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Logout
      </button> */}
    </div>
  );
};

export default SpotifyActivity;
