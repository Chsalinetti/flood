// Album.js
import React from 'react';
import './Album.css';

function Album({ album, fetchAllAlbums }) {
  const handleHide = async () => {
    try {
      const response = await fetch(`/remove_album/${album.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Album hidden/unhidden successfully');
        fetchAllAlbums();
      } else {
        console.error('Failed to toggle hide album');
      }
    } catch (error) {
      console.error('Error toggling hide album:', error);
    }
  };

  return (
    <div className="Album">
      <div className="Album-top">
        <button>{album.title}</button>
        <button>{album.artist}</button>
        <button>{album.year}</button>
        <button className="hide-button" onClick={handleHide}>X</button>
      </div>
      <div className="Album-bottom">
        {album.tags.split(',').map(tag => (
          <button key={tag.trim()}>{tag.trim()}</button>
        ))}
        <button className="add-tag-button">+</button>
      </div>
    </div>
  );
}

export default Album;
