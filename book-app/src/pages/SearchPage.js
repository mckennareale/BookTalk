import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Button } from '@mui/material';
import '../css/variables.css';
import '../css/SearchPage.css';
import SortIcon from '@mui/icons-material/Sort';
import SearchDrawer from '../components/SearchDrawer';
import PartialBookCard from '../components/PartialBookCard';


const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [books, setBooks] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // this var is being pass into PartialBookCard component. it is a list of bookids
  const bookTest = ["0826211062", "B000890HE2", "isbn3", "0006498329", 
    "0006750605",
    "0007138865",
    "0020295804",
    "0020427700", 
  "0826414346", "0829814000", "0595344550", "0253338352"];






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
        <PartialBookCard bookIds={bookTest} />
      </div>
    </div>
  );
};

export default SearchPage;
