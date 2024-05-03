// AlbumList.js
import React from 'react';
import Album from './Album';

function AlbumList({ albums, fetchAllAlbums }) {
  return (
    <div>
      {albums.map(album => (
        <Album key={album.id} album={album} fetchAllAlbums={fetchAllAlbums} />
      ))}
    </div>
  );
}

export default AlbumList;
