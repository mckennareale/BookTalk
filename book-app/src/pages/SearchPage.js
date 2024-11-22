import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Button } from '@mui/material';
import '../css/variables.css';
import '../css/SearchPage.css';
import SortIcon from '@mui/icons-material/Sort';
import SearchDrawer from '../components/SearchDrawer';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [books, setBooks] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSearch = () => {
    // TODO: Implement search logic to fetch books based on searchTerm and filter
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <div>
      <h1>Search for a Book</h1>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          className="search-bar"
          type="text"
          placeholder="Search for a book."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="magnifying-glass" onClick={handleSearch}>
          <FaSearch size={50} />
        </button>
        <Button onClick={toggleDrawer(true)} className="sort-button">
          <SortIcon style={{ fontSize: '70px' }} />
        </Button>
      </div>

      <SearchDrawer open={drawerOpen} toggleDrawer={toggleDrawer} setFilter={setFilter} />

      <div>
        <h2>Search Results</h2>
        {books.length > 0 ? (
          <ul>
            {books.map((book) => (
              <li key={book.id}>{book.title} by {book.author}</li>
            ))}
          </ul>
        ) : (
          <p>No books found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
