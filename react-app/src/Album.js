import React, { useState } from 'react';
import './Album.css';

function Album({ album, fetchAllAlbums }) {
  const [isTitleEditing, setTitleEditing] = useState(false);
  const [isArtistEditing, setArtistEditing] = useState(false);
  const [isYearEditing, setYearEditing] = useState(false);
  const [isAddingTag, setAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [titleInput, setTitleInput] = useState(album.title);
  const [artistInput, setArtistInput] = useState(album.artist);
  const [yearInput, setYearInput] = useState(album.year);
  const [inputTimer, setInputTimer] = useState(null);
  const [hoveredTag, setHoveredTag] = useState('');

  const handleEdit = async (field, value) => {
    try {
      const response = await fetch(`/edit_${field}/${album.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });
      if (response.ok) {
        console.log(`${field} updated successfully`);
        fetchAllAlbums();
      } else {
        console.error(`Failed to update ${field}`);
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  const debounceInput = (field, value) => {
    clearTimeout(inputTimer);
    setInputTimer(
      setTimeout(() => {
        handleEdit(field, value);
      }, 500) // Adjust the debounce delay as needed
    );
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field === 'title') {
      setTitleInput(value);
      debounceInput(field, value);
    } else if (field === 'artist') {
      setArtistInput(value);
      debounceInput(field, value);
    } else if (field === 'year') {
      setYearInput(value);
      debounceInput(field, value);
    } else if (field === 'newTag') {
      setNewTag(value);
    }
  };

  const handleTagSubmit = async () => {
    try {
      const response = await fetch(`/add_tags/${album.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags: [newTag] }),
      });
      if (response.ok) {
        console.log('Tag added successfully');
        fetchAllAlbums();
        setNewTag('');
        setAddingTag(false);
      } else {
        console.error('Failed to add tag');
      }
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const handleTagDelete = async (tagToDelete) => {
    try {
      const response = await fetch(`/remove_tags/${album.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tag: tagToDelete }),
      });
      if (response.ok) {
        console.log('Tag removed successfully');
        fetchAllAlbums();
      } else {
        console.error('Failed to remove tag');
      }
    } catch (error) {
      console.error('Error removing tag:', error);
    }
  };

  const handleHide = async () => {
    try {
      const response = await fetch(`/toggle_hide/${album.id}`, {
        method: 'PUT',
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
        {isTitleEditing ? (
          <input
            type="text"
            value={titleInput}
            onChange={(e) => handleInputChange(e, 'title')}
            onBlur={() => setTitleEditing(false)}
            autoFocus
          />
        ) : (
          <button onClick={() => setTitleEditing(true)}>{album.title}</button>
        )}
        {isArtistEditing ? (
          <input
            type="text"
            value={artistInput}
            onChange={(e) => handleInputChange(e, 'artist')}
            onBlur={() => setArtistEditing(false)}
          />
        ) : (
          <button onClick={() => setArtistEditing(true)}>{album.artist}</button>
        )}
        {isYearEditing ? (
          <input
            type="text"
            value={yearInput}
            onChange={(e) => handleInputChange(e, 'year')}
            onBlur={() => setYearEditing(false)}
          />
        ) : (
          <button onClick={() => setYearEditing(true)}>{album.year}</button>
        )}
        <button className="hide-button" onClick={handleHide}>
          X
        </button>
      </div>
      <div className="Album-bottom">
        {album.tags.split(',').map((tag) => (
          <button
            key={tag.trim()}
            style={{ backgroundColor: hoveredTag === tag.trim() ? '#8B0000' : '' }}
            onMouseEnter={() => setHoveredTag(tag.trim())}
            onMouseLeave={() => setHoveredTag('')}
            onClick={() => handleTagDelete(tag.trim())}
          >
            {tag.trim()}
          </button>
        ))}
        {isAddingTag ? (
          <>
            <input
              type="text"
              value={newTag}
              onChange={(e) => handleInputChange(e, 'newTag')}
              placeholder="Enter tag"
            />
            <button onClick={handleTagSubmit}>Submit</button>
            <button onClick={() => setAddingTag(false)}>Cancel</button>
          </>
        ) : (
          <button className="add-tag-button" onClick={() => setAddingTag(true)}>
            +
          </button>
        )}
      </div>
    </div>
  );
}

export default Album;
