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
        const accessToken = await getAccessToken(authorizationCode);
        console.log('Access Token:', accessToken);
        
    
        
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

  return (
    <div>
      <button onClick={handleUpdateFromSpotify} disabled={loading}>
        {loading ? 'Updating...' : 'Update from Spotify'}
      </button>
    </div>
  );
}

export default UpdateFromSpotifyButton;
