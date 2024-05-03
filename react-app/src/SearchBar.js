import React from 'react';

function SearchBar({ albums, setSearchResults }) {
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredAlbums = albums.filter(album =>
      album.title.toLowerCase().includes(searchTerm) ||
      album.artist.toLowerCase().includes(searchTerm) ||
      (album.year && album.year.toString().includes(searchTerm)) ||
      (album.tags && album.tags.toLowerCase().includes(searchTerm))
    );
    setSearchResults(filteredAlbums);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search..."
        onChange={handleSearch}
      />
    </div>
  );
}

export default SearchBar;
