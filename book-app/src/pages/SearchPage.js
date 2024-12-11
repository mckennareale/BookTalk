import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Button, TextField, Typography, useTheme } from '@mui/material';
import '../css/variables.css';
import '../css/SearchPage.css';
import SortIcon from '@mui/icons-material/Sort';
import SearchDrawer from '../components/SearchDrawer';
import PartialBookCard from '../components/PartialBookCard';
import SearchResults from '../components/SearchResults';


const SearchPage = () => {
  const theme = useTheme();
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
    setDrawerOpen(false); // Close drawer only when applying filters
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerOpen(open);
  };

  return (
    <div>
      <Typography variant="h1" sx={{ paddingTop: '2rem' }}>Search for a Book</Typography>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <TextField
          sx={{ 
            backgroundColor: 'white',
            borderRadius: 1,
            width: '100%',
            marginLeft: '20px'
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="magnifying-glass" onClick={handleSearch} style={{ marginRight: '10px' }}>
          <FaSearch size={40} />
        </button>
        <Button 
          onClick={toggleDrawer(true)} 
          className="sort-button"
          sx={{ color: theme.palette.primary.main }}
        >
          <SortIcon style={{ fontSize: '70px' }} />
        </Button>
      </div>

      <SearchDrawer
        open={drawerOpen}
        toggleDrawer={toggleDrawer}
        applyFilters={handleApplyFilters}
      />

      <div>
        <Typography variant="h2">Search Results</Typography>
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
