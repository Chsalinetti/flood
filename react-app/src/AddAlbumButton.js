// AddAlbumButton.js
import React, { useState } from 'react';

function AddAlbumButton({ fetchAllAlbums }) {
  const [showPopup, setShowPopup] = useState(false);
  const [albumData, setAlbumData] = useState({ title: '', artist: '', year: '', tags: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAlbumData({ ...albumData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/add_album', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(albumData),
      });
      if (response.ok) {
        console.log('Album added successfully');
        setShowPopup(false);
        fetchAllAlbums();
      } else {
        console.error('Failed to add album');
      }
    } catch (error) {
      console.error('Error adding album:', error);
    }
  };

  return (
    <div>
      <button onClick={() => setShowPopup(true)}>Add Album</button>
      {showPopup && (
        <div>
          <form onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Title" onChange={handleInputChange} />
            <input type="text" name="artist" placeholder="Artist" onChange={handleInputChange} />
            <input type="text" name="year" placeholder="Year" onChange={handleInputChange} />
            <input type="text" name="tags" placeholder="Tags (comma-separated)" onChange={handleInputChange} />
            <button type="submit">Add</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AddAlbumButton;
