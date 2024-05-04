import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './SearchBar';
import AlbumList from './AlbumList';
import UpdateFromSpotifyButton from './UpdateFromSpotifyButton';

const CLIENT_ID = '62bb217b2dc74ab8a7f2dd22c468b1f0';
const REDIRECT_URI = 'http://localhost:3000';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'code';

function App() {
  const [albums, setAlbums] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddAlbumForm, setShowAddAlbumForm] = useState(false);
  const [newAlbumData, setNewAlbumData] = useState({
    title: '',
    artist: '',
    year: '',
    tags: '',
    type: 'manually_added' // Set type to 'manually_added' by default
  });
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  useEffect(() => {
    if (!spotifyConnected && !window.location.href.includes("code=")) {
      console.log("Connecting To Spotify...")
      window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-library-read`;
      setSpotifyConnected(true);
    } else if (!spotifyConnected && window.location.href.includes("code=")) {
      console.log('Connected to Spotify.');
      setSpotifyConnected(true);
    }
    fetchAllAlbums();
  }, [spotifyConnected]);

  const fetchAllAlbums = async () => {
    try {
      const response = await fetch('/get_all_albums');
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase().trim());
  };

  const handleAddAlbum = async () => {
    try {
      // Split tags by commas and trim whitespace
      const tagsArray = newAlbumData.tags.split(',').map(tag => tag.trim());
      const albumDataWithTags = {
        ...newAlbumData,
        tags: tagsArray
      };

      const response = await fetch('/add_album', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(albumDataWithTags)
      });
      if (response.ok) {
        await fetchAllAlbums();
        setShowAddAlbumForm(false);
        setNewAlbumData({
          title: '',
          artist: '',
          year: '',
          tags: '',
          type: 'manually_added'
        });
      } else {
        console.error('Failed to add album');
      }
    } catch (error) {
      console.error('Error adding album:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAlbumData({
      ...newAlbumData,
      [name]: value
    });
  };

  const filteredAlbums = albums.filter(album => {
    const title = album.title ? album.title.toString().toLowerCase() : '';
    const artist = album.artist ? album.artist.toString().toLowerCase() : '';
    const year = album.year ? album.year.toString() : '';
    const tagsArray = album.tags ? (Array.isArray(album.tags) ? album.tags.map(tag => tag.toString().toLowerCase().trim()) : album.tags.split(",").map(tag => tag.toLowerCase().trim())) : [];
  
    const albumData = [
      title,
      artist,
      year,
      ...tagsArray
    ];
  
    const queryTerms = searchQuery.toLowerCase().split(',').map(term => term.trim());
  
    return queryTerms.every(queryTerm =>
      albumData.some(term => term.includes(queryTerm))
    );
  });
  

  return (
    <div className="App">
      <header className="App-header">
        Tag Yr. Music
        <UpdateFromSpotifyButton />
        {showAddAlbumForm ? (
          <div className='Header-buttons'>
            <input type="text" name="title" value={newAlbumData.title} onChange={handleInputChange} placeholder="Title" />
            <input type="text" name="artist" value={newAlbumData.artist} onChange={handleInputChange} placeholder="Artist" />
            <input type="text" name="year" value={newAlbumData.year} onChange={handleInputChange} placeholder="Year" />
            <input type="text" name="tags" value={newAlbumData.tags} onChange={handleInputChange} placeholder="Tags (comma separated)" />
            <button onClick={handleAddAlbum}>Add</button>
            <button onClick={() => setShowAddAlbumForm(false)}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => setShowAddAlbumForm(true)}>Add Album</button>
        )}
        <SearchBar onSearch={handleSearch} />
      </header>
      <main>
        <AlbumList albums={filteredAlbums} fetchAllAlbums={fetchAllAlbums} />
      </main>
    </div>
  );
}

export default App;
