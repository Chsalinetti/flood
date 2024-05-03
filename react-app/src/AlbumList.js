import React from 'react';

import './AlbumList.css'; // Import CSS file

function AlbumList({ albums }) {
  return (
    <div className="album-list">
      {albums.map(album => (
        <div key={album.id} className="album">
          <h2>{album.title}</h2>
          <p>Artist: {album.artist}</p>
          <p>Year: {album.year}</p>
          <p>Tags: {album.tags}</p>
          {/* Add buttons for editing and other actions */}
        </div>
      ))}
    </div>
  );
}

export default AlbumList;
