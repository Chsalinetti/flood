// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './SearchBar';
import AlbumList from './AlbumList';
import AddAlbumButton from './AddAlbumButton';
import UpdateFromSpotifyButton from './UpdateFromSpotifyButton';

function App() {
  const [albums, setAlbums] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredAlbums = albums.filter(album => {
    const searchTerms = [
      album.title.toString(),
      album.artist.toString(),
      album.year.toString(),
      ...(Array.isArray(album.tags) ? album.tags.map(tag => tag.toString()) : [])
    ];
    return searchTerms.some(term => term.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="App">
      <header className="App-header">
        <SearchBar onSearch={handleSearch} />
        <AddAlbumButton fetchAllAlbums={fetchAllAlbums} />
        <UpdateFromSpotifyButton />
      </header>
      <main>
        <AlbumList albums={filteredAlbums} fetchAllAlbums={fetchAllAlbums} />
      </main>
    </div>
  );
}

export default App;
