import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import { Container, Box } from '@mui/material'; // Import Container and Box from Material-UI
import '../css/PartialBookCard.css'; // Import the CSS file for styles
import { Button, Typography, useTheme } from '@mui/material';
import { customFetch } from "../utils/customFetch";

const SearchResults = ({ searchMode, title, filters }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);

  // need to figure out how to clear....

  useEffect(() => {
    let query;
    
    const time_periods = [
      "modern",
      "20th century",
      "19th century",
      "medieval",
      "ancient"
    ];

    // Clean up filters by removing null, empty string, or false values
    const cleanedFilters = filters ? Object.fromEntries(
      Object.entries(filters).map(([key, value]) => {
        if (key === 'timePeriod' && value) {
          const periodValue = value.toString().toLowerCase();
          const periodIndex = time_periods.indexOf(periodValue);
          const finalValue = periodIndex !== -1 ? (periodIndex + 1).toString() : value;
          return [key, finalValue];
        }
        if (key === 'classification' && value) {
          if (value != 'YA') {
            const classValue = value.toString().toLowerCase();
            return [key, classValue];
          }
        }
        if (key === 'category' && value) {
          console.log("Category Value:", value);
          const categoryValue = value.toString().toLowerCase();
          console.log("Category updated Value:", categoryValue);
          return [key, categoryValue];
        }
        return [key, value];
      }).filter(([_, value]) => value !== null && value !== '' && value !== false)
    ) : {};
    console.log('Final Cleaned Filters:', cleanedFilters); // Debugging log

    // Check if title is empty and handle accordingly
    if (searchMode === 'filter') {
      query = cleanedFilters;
    } else if (title) {
      query = { title };
    } else {
      console.log("No title/filters provided, skipping fetch.");
      setLoading(false);
      return;
    }

    // Move the fetch logic inside a new block to ensure it only runs when we have a valid query
    if (query && Object.keys(query).length > 0) {
      console.log("Final Payload:", JSON.stringify({ data: query }));

      customFetch(`${process.env.REACT_APP_API_BASE}/books/search`, {
        method: 'POST',
        body: JSON.stringify({
          data: query
        })
      })
      .then((data) => {
        console.log("Processed Data:", data);
        setBooks(data.data || []);
        console.log("Books State after Update:", books);
      })
      .catch((err) => {
        console.error("Error Caught:", err);
        setError(err.message || 'Error fetching book details');
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [searchMode, title, filters]); // Re-run when mode, query, or filters change

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container 
      className="book-results-container"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '16px',
        padding: '24px'
      }}
    >
      {books.length > 0 ? ( // Check if there are books to render
        books.map((book) => (
          <Box 
            key={book.isbn} 
            p={2} 
            m={2} 
            className="book-tile"
            sx={{
              width: '250px',
              height: '320px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              paddingTop: '24px',
              textAlign: 'center',
              paddingLeft: '25px'
            }}
          >
            <img
              src={book.image}
              alt={`${book.title} book art`}
              className="book-cover"
              style={{
                width: '130px',
                height: '180px',
                objectFit: 'cover',
                marginBottom: '8px'
              }}
            />
            <div className="book-info" style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%'
            }}>
              <Typography 
                variant="h6" // Changed from h4 to h6 for better sizing
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.4em',
                  maxHeight: '2.8em',
                  marginBottom: '8px',
                  wordWrap: 'break-word'
                }}
              >
                <NavLink 
                  to={`/books/${book.isbn}`}
                  style={{ 
                    color: theme.palette.text.secondary,
                    textDecoration: 'none'
                  }}
                >
                  {book.title || 'None'}
                </NavLink>
              </Typography>
              <Typography 
                variant="body2" // Changed from body1 to body2
                sx={{
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                Category: {(book.category && book.category.replace(/[\[\]']/g, '').charAt(0).toUpperCase() + book.category.slice(1)) || 'None'}
              </Typography>
              <Typography variant="body2">
                Average Rating: {book.average_rating || 'None'}
              </Typography>
            </div>
          </Box>
        ))
      ) : (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '10vh',
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="h4"
            style={{ 
              fontSize: '24px', // Increase font size
              fontWeight: 'bold', // Make text bold
              color: '#333' // Change text color for better visibility
            }}
          >
            No books found.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default SearchResults;
