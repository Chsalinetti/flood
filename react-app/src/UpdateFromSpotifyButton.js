import React, { useState } from 'react';
import axios from 'axios';
import querystring from 'querystring';
import { CLIENT_SECRET } from './sec';

const CLIENT_ID = '62bb217b2dc74ab8a7f2dd22c468b1f0';
const REDIRECT_URI = 'http://localhost:3000';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const RESPONSE_TYPE = 'code';

function UpdateFromSpotifyButton() {
  const [loading, setLoading] = useState(false);

  const handleUpdateFromSpotify = async () => {
    setLoading(true);
    try {
      // Redirect user to Spotify authorization page
      console.log('Connecting...');
      window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-library-read`;
      console.log('Connection Successful!');
      console.log('Reading Albums...');
      // Once the user is redirected back to your application with the authorization code
      const authorizationCode = window.location.search.split('code=')[1];
      if (authorizationCode) {
        const accessToken = await getAccessToken(authorizationCode);
        console.log('Access Token:', accessToken);
        
        //
        
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
