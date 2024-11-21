import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // Importing a magnifying glass icon
import { Drawer, Button, List, ListItem, ListItemText } from '@mui/material'; // Importing MUI components
import NavigationBar from '../components/NavigationBar';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState(''); // Example filter state
  const [books, setBooks] = useState([]); // State to hold search results
  const [drawerOpen, setDrawerOpen] = useState(false); // State to control drawer visibility

  const handleSearch = () => {
    // TODO: Implement search logic to fetch books based on searchTerm and filter
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // opens 
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <div>
      <h1>Search for a Book</h1>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Search for a book."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{ width: '1400px', padding: '10px', fontSize: '40px' }} // Increased width and padding
        />
        <button 
          onClick={handleSearch} 
          style={{ position: 'absolute', right: '30px', top: '7px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
        <FaSearch size={50} /> {/* Magnifying glass icon */}
        </button>
      </div>

      <Button variant="outlined" onClick={toggleDrawer(true)}>Open Filters</Button>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          style={{ width: 250 }}
        >
          <List>
            <ListItem>
              <ListItemText primary="Select Filter" />
            </ListItem>
            <ListItem button onClick={() => setFilter('author')}>
              <ListItemText primary="Author" />
            </ListItem>
            <ListItem button onClick={() => setFilter('genre')}>
              <ListItemText primary="Genre" />
            </ListItem>
            <ListItem button onClick={() => setFilter('year')}>
              <ListItemText primary="Publication Year" />
            </ListItem>
            {/* Add more filter options as needed */}
          </List>
        </div>
      </Drawer>

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
