import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import AlbumList from './AlbumList';
import AddAlbumPopup from './AddAlbumPopup';
import './Table.css';

function Table() {
  const [albums, setAlbums] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showAddAlbumPopup, setShowAddAlbumPopup] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_all_albums');
      setAlbums(response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching albums:', error);
      // Set state or display error message to the user
    }
  };

  const handleAddAlbum = async (newAlbum) => {
    try {
      await axios.post('http://localhost:5000/add_album', { ...newAlbum, type: 'manually_added' });
      setShowAddAlbumPopup(false);
      fetchAlbums();
    } catch (error) {
      console.error('Error adding album:', error);
      // Set state or display error message to the user
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setSearchResults(albums);
    } else {
      const filteredAlbums = albums.filter(album =>
        album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (album.year && album.year.toString().includes(searchTerm)) ||
        (album.tags && album.tags.toLowerCase().includes(searchTerm))
      );
      setSearchResults(filteredAlbums);
    }
  };

  return (
    <div className="container">
      <h1>Albums</h1>
      <div className="toolbar">
        <SearchBar albums={albums} setSearchResults={setSearchResults} />
        <button className="add-album-button" onClick={() => setShowAddAlbumPopup(true)}>+</button>
      </div>
      <AlbumList albums={searchResults} />
      {showAddAlbumPopup && <AddAlbumPopup onClose={() => setShowAddAlbumPopup(false)} onAddAlbum={handleAddAlbum} />}
    </div>
  );
}

export default Table;
