import React, { useEffect, useRef, useState } from "react";
import { 
  Container, 
  Box, 
  Typography, 
  IconButton, 
  Button,
  Menu,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  CircularProgress,
} from "@mui/material";
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FilterListIcon from '@mui/icons-material/FilterList';

const BrowseMoreSection = ({ data, loading, error }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [currentRow, setCurrentRow] = useState(0);
  const rowsRef = useRef([]);
  const [books, setBooks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
const [filterValue, setFilterValue] = useState('');
let queryParams = "";
  
  // Simplified filter states
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    handleFilterClose();
    handleQueryParams();
  };
  
  const handleQueryParams = () => {
    let params = "criteria=";
    switch(selectedFilter?.toLowerCase()) {
      case 'author':
        params += 'top_authors';
        break;
      case 'classification':
        params += 'classification';
        break;
      case 'category':
        params += 'top_categories';
        break;
      default:
        break;
    }
    queryParams = params;
  };

  const fetchBooks = () => {
    // Build query parameters based on selected filter

    // Only fetch if we have query parameters
    if (queryParams.length > 0) {
      setIsLoading(true);
      const encodedQueryParams = encodeURIComponent(queryParams);
      const url = `${process.env.REACT_APP_API_BASE}/book_recs?${encodedQueryParams}`;

      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(async (res) => {
        console.log("Response Object:", res);
        console.log("Response Status:", res.status);
        console.log("Response Status Text:", res.statusText);
        
        if (!res.ok) {
          const errorMessage = `Network response was not ok: ${res.statusText}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
        
        const data = await res.json();
        console.log("Parsed Response Data:", data);
        
        return data;
      })
      .then((data) => {
        const newBooks = data.data;
        console.log("Processed Data:", newBooks);
        setBooks(newBooks);
        setCurrentRow(0);
      })
      .catch((err) => {
        console.error("Error Caught:", err);
        // setError(err.message || 'Error fetching book details');
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  };

  // Group books into rows of 3
  const rows = [];
  for (let i = 0; i < books.length; i += 4) {
    rows.push(books.slice(i, i + 4));
  }

  const handleNext = () => {
    setCurrentRow((prev) => (prev + 1) % rows.length);
  };

  const handlePrev = () => {
    setCurrentRow((prev) => (prev - 1 + rows.length) % rows.length);
  };

  useEffect(() => {
    console.log("Selected Filter:", selectedFilter); // For debugging
    if (selectedFilter) {
      handleQueryParams();
      fetchBooks();
    }
  }, [selectedFilter]);

  return (
    <Box
      sx={{
        pl: 2,
        pr: 2,
        pt: 5,
        height: '75vh',
        position: 'relative',
      }}
    >
      {/* Header with Title and Filter */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography 
          variant="h2" 
          sx={{ 
            color: 'primary.main',
          }}>
          browse more...
        </Typography>

        <Button
          onClick={handleFilterClick}
          startIcon={<FilterListIcon />}
          sx={{
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: 'rgba(164, 74, 63, 0.04)',
            }
          }}
          variant="outlined"
        >
          {selectedFilter || 'Filter'}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleFilterClose}
          PaperProps={{
            sx: {
              mt: 1,
              width: 200,
            }
          }}
        >
          {['Classification', 'Author', 'Category'].map((filter) => (
            <MenuItem 
              key={`filter-${filter}`}
              onClick={() => handleFilterSelect(filter)}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: 'rgba(164, 74, 63, 0.04)',
                },
                fontWeight: selectedFilter === filter ? 'bold' : 'normal',
              }}
            >
              {filter}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Carousel Container */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          height: 'calc(100% - 120px)',
        }}
      >
        {isLoading ? (
          <CircularProgress 
            sx={{ 
              color: theme.palette.primary.main,
            }} 
          />
        ) : books.length > 0 ? (
          <>
            {/* Previous Button */}
            <IconButton 
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: 0,
                zIndex: 2,
                color: theme.palette.primary.main,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>

            {/* Books Container */}
            <Box
              sx={{
                display: 'flex',
                gap: '24px',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '1200px',
                overflow: 'hidden',
              }}
            >
              {rows[currentRow]?.map((book, index) => (
                <Box 
                  key={`book-${book.isbn}-${index}`}
                  sx={{
                    width: '250px',
                    height: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    padding: '24px',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <img
                    src={book.image}
                    alt={`${book.title} cover`}
                    style={{
                      width: '130px',
                      height: '180px',
                      objectFit: 'cover',
                      marginBottom: '8px',
                    }}
                  />
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="h6"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.4em',
                        maxHeight: '2.8em',
                        mb: 1,
                      }}
                    >
                      <NavLink 
                        to={`/books/${book.id}`}
                        style={{ 
                          color: theme.palette.text.secondary,
                          textDecoration: 'none',
                        }}
                      >
                        {book.title}
                      </NavLink>
                    </Typography>
                    <Typography variant="body2">
                      Rating: {book.avg_rating}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Next Button */}
            <IconButton 
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 0,
                zIndex: 2,
                color: theme.palette.primary.main,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </>
        ) : (
          // Empty state message
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              color: theme.palette.text.secondary,
            }}
          >
            <FilterListIcon 
              sx={{ 
                fontSize: '48px', 
                mb: 2,
                color: theme.palette.primary.main,
              }} 
            />
            <Typography variant="h6" gutterBottom>
              No books to display yet
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Use the filter button above to start exploring books
            </Typography>
          </Box>
        )}
      </Box>

      {/* Navigation Dots - Only show if there are books */}
      {books.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            mt: 2,
          }}
        >
          {rows.map((_, index) => (
            <Box
              key={`nav-dot-${index}`}
              onClick={() => setCurrentRow(index)}
              sx={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: currentRow === index 
                  ? theme.palette.primary.main 
                  : theme.palette.grey[300],
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default BrowseMoreSection;
