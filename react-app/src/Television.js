import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Television.css';
import AlbumArt from './AlbumArt';
import Image from './Image';
import axios from 'axios';
import querystring from 'querystring';
//create a sec.js file in src with the following:
//export const CLIENT_SECRET = '<Spotify Client Secret>';

import {CLIENT_SECRET} from './sec';

const CLIENT_ID = 'ddc52ef734194f2492bc8bc09c0fe151'
const REDIRECT_URI = "http://localhost:3000"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const RESPONSE_TYPE = "code"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {album: '',
                  refresh: '',
                };
  }
  
  componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 3000);
  }
  /**
   * Resets image update timer
   */
  componentWillUnmount() {
    clearInterval(this.interval);
    this.forceUpdate();
  }

  /**
   * 
   * @returns Gets refresh token from Spotify after logging in.
   */
  getToken=async()=> {

    if (this.state.refresh === '') {
      const link = window.location.href
      if (link === 'http://localhost:3000/') {
        return;
      }
      const authorization_code = link.substring(1).split("?").find(elem => elem.startsWith("code")).split("=")[1];

      if (authorization_code === null) {
        return;
      }

      try {
        console.log("Acquiring Access Code")
        //Acquires token and refresh token from Spotify
        const r =await axios({
          method: 'post',
          url: 'https://accounts.spotify.com/api/token',
          data: querystring.stringify({
            grant_type: 'authorization_code',
            code: authorization_code,
            redirect_uri: REDIRECT_URI
          }),
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
          },
        })
        this.setState({refresh: r.data.refresh_token});
        return;
        }
        catch (err) {
          console.log(err);
          return;
        }
    }
  }


/**
 * Gets current album from Spotify
 * @returns Album Link
 */
  getArt=async()=> {
    console.log("Updating Album Art")
    if (this.state.refresh === '') {
      return;
    }
    try{
      //Get token from Spotify using refresh token
      const r = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: querystring.stringify({
          grant_type: 'refresh_token',
          refresh_token: this.state.refresh,
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
      })
      
      //Gets album art from Spotify
      const response = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
          'Authorization': `Bearer ${r.data.access_token}`
        }
      });

      //console.log(response.data.item.album.images[0].url);
      if (response.status === 200) {
        if (response.data.is_playing) {
          if (this.state.album !== response.data.item.album.images[0].url) {
            this.setState({album: response.data.item.album.images[0].url});
          }
        }
        else {
          //If not playing, set to nothing
          if (this.state.album !== '') {
            this.setState({album: ''});
          }
        }
        
      }
    }
    catch {
      if (this.state.album !== '') {
        this.setState({album: ''});
      }
    }
  }
/**
 * Renders either Album art or normal Art
 * @returns What to render
 */
  renderArt=()=> {
    console.log("Rerender")
    this.getArt();
    if (this.state.album === '') {
      return (<Image/>);
    }
    else {
      return (<AlbumArt albumArt={this.state.album}/>);
    }
  }

  render() {
    this.getToken();
    return(
      <div className="App">
        {this.renderArt()}
        <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-read-currently-playing`}>-</a>
      </div>
    )
  }
}
export default App;

