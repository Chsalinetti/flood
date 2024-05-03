import React, { useState } from 'react';
import './AddAlbumPopup.css'; // Import CSS file

function AddAlbumPopup({ onClose, onAddAlbum }) {
  const [albumData, setAlbumData] = useState({});

  const handleChange = (e) => {
    setAlbumData({ ...albumData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onAddAlbum(albumData);
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Add Album</h2>
        <input type="text" name="title" placeholder="Title" onChange={handleChange} />
        <input type="text" name="artist" placeholder="Artist" onChange={handleChange} />
        <input type="number" name="year" placeholder="Year" onChange={handleChange} />
        <button onClick={handleSubmit}>Add Album</button>
      </div>
    </div>
  );
}

export default AddAlbumPopup;
