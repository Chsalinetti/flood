// SearchBar.js
import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div>
      <input type="text" placeholder="Search albums..." value={searchQuery} onChange={handleChange} />
    </div>
  );
}

export default SearchBar;
