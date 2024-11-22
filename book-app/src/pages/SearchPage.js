import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Button } from '@mui/material';
import '../css/variables.css';
import '../css/SearchPage.css';
import SortIcon from '@mui/icons-material/Sort';
import SearchDrawer from '../components/SearchDrawer';
import PartialBookCard from '../components/PartialBookCard';
import SearchResults from '../components/SearchResults';


const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [searchMode, setSearchMode] = useState(''); // Tracks "search" or "filter"
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [titleTerm, setTitleTerm] = useState(''); //

  const testBookIds = ["0027085201", "0006551475", "0140236090", "0345462351",
    "034546236X",
    "0373261772",
    "0373441150",
    "0374117349",
    "0374223076"]

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setFilters({}); // Clear filters
      setSearchMode('search'); // Set mode to "search"
      setTitleTerm(searchTerm);
      console.log(searchTerm)
      console.log(titleTerm)
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleApplyFilters = (appliedFilters) => {
    setSearchTerm(''); // Clear search input
    setFilters(appliedFilters); // Set filters
    setSearchMode('filter'); // Set mode to "filter"
    setDrawerOpen(false); // Close drawer
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
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

      <SearchDrawer
        open={drawerOpen}
        toggleDrawer={toggleDrawer}
        applyFilters={handleApplyFilters}
      />

      <div>
        <h2>Search Results</h2>
        <SearchResults
          searchMode={searchMode}
          title={titleTerm}
          filters={filters}
        />
      </div>
    </div>
  );
};

export default SearchPage;
