import React, { useState } from 'react';
import axios from 'axios';
import querystring from 'querystring';
import { CLIENT_SECRET } from './sec';

const CLIENT_ID = '62bb217b2dc74ab8a7f2dd22c468b1f0';
const REDIRECT_URI = 'http://localhost:3000';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

function UpdateFromSpotifyButton() {
  const [loading, setLoading] = useState(false);

  const handleUpdateFromSpotify = async () => {
    setLoading(true);
    try {
      const authorizationCode = window.location.search.split('code=')[1];
      if (authorizationCode) {
        console.log("Getting Access Token...");
        const accessToken = await getAccessToken(authorizationCode);
        console.log('Access Token:', accessToken);
        console.log("Getting user's saved albums...");
        const albums = await getUserSavedAlbums(accessToken);
        console.log('User\'s Saved Albums:', albums);
        console.log("Sending albums to backend...");
        await sendAlbumsToBackend(albums);
        console.log("Albums sent to backend successfully");
      }
    } catch (error) {
      console.error('Error updating from Spotify:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAccessToken = async (authorizationCode) => {
    try {
      const response = await axios.post(
        TOKEN_ENDPOINT,
        querystring.stringify({
          grant_type: 'authorization_code',
          code: authorizationCode,
          redirect_uri: REDIRECT_URI,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
          },
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  };

  const getUserSavedAlbums = async (accessToken) => {
    try {
      console.log("Fetching user's saved albums...");
      let albums = [];
      let nextUrl = 'https://api.spotify.com/v1/me/albums';
  
      while (nextUrl) {
        console.log("Fetching albums from:", nextUrl);
        const response = await axios.get(nextUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            limit: 50,
          },
        });
        albums = [...albums, ...response.data.items];
        nextUrl = response.data.next;
      }
      console.log('User\'s Saved Albums:', albums);
      return albums;
    } catch (error) {
      console.error('Error getting user\'s saved albums:', error);
      throw error;
    }
  };
  

  const sendAlbumsToBackend = async (albums) => {
    try {
      await axios.post('/update_from_spotify', { albums });
    } catch (error) {
      console.error('Error sending albums to backend:', error);
      throw error;
    }
  };

  return (
    <div>
      <button onClick={handleUpdateFromSpotify} disabled={loading}>
        {loading ? 'Updating...' : 'Update from Spotify'}
      </button>
    </div>
  );
}

export default UpdateFromSpotifyButton;
