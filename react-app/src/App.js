// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './SearchBar';
import AlbumList from './AlbumList';
import AddAlbumButton from './AddAlbumButton';
import UpdateFromSpotifyButton from './UpdateFromSpotifyButton';

function App() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetchAllAlbums();
  }, []);

  const fetchAllAlbums = async () => {
    try {
      const response = await fetch('/get_all_albums');
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <SearchBar />
        <AddAlbumButton fetchAllAlbums={fetchAllAlbums} />
        <UpdateFromSpotifyButton />
      </header>
      <main>
        <AlbumList albums={albums} fetchAllAlbums={fetchAllAlbums} />
      </main>
    </div>
  );
}

export default App;
