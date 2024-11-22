import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import { Container, Box } from '@mui/material'; // Import Container and Box from Material-UI
import '../css/PartialBookCard.css'; // Import the CSS file for styles

const SearchResults = ({ searchMode, title, filters }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);

  // need to figure out how to clear....

  useEffect(() => {
    let query;
    console.log('Search Mode:', searchMode); // Debugging log
    console.log('Title:', title); // Debugging log
    console.log('Filters:', filters); // Debugging log

        // Check if title is empty and handle accordingly
        if (searchMode === 'filter') {
          query = JSON.stringify(filters); // Payload for filters
        } else if (title) {
          query = { title }; // Payload for search
        } else {
          console.log("No title provided, skipping fetch.");
          setLoading(false); // Set loading to false if no title
          return; // Exit early if title is empty
        }

    console.log(query);
    console.log("Final Payload:", JSON.stringify({ data: query })); // Logs the full payload

    fetch(`${process.env.REACT_APP_API_BASE}/books/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: query
      }) 

    })
    .then(async (res) => {
      console.log("Response Object:", res); // Logs the full response object
  
      // Log response status and status text
      console.log("Response Status:", res.status); 
      console.log("Response Status Text:", res.statusText); 
      
      if (!res.ok) { // Check if the response status indicates an error
          const errorMessage = `Network response was not ok: ${res.statusText}`; 
          console.error(errorMessage); 
          throw new Error(errorMessage);
      }
  
      // Parse and log the response body as JSON
      const data = await res.json();
      console.log("Parsed Response Data:", data); 
  
      return data;
  })
  .then((data) => {
      console.log("Processed Data:", data); // Log the final data received
      setBooks(data.data || []); // Update the state with books
      console.log("Books State after Update:", books); // Log the updated books state

  })
  .catch((err) => {
      console.error("Error Caught:", err); // Log the error for debugging
      setError(err.message || 'Error fetching book details'); // Set the error state
  })
  .finally(() => {
      setLoading(false); // Set loading to false regardless of success or failure
  });
  
  }, [searchMode, title, filters]); // Re-run when mode, query, or filters change

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container className="book-results-container">
      {books.length > 0 ? ( // Check if there are books to render
        books.map((book) => (
          <Box key={book.isbn} p={2} m={2} className="book-tile">
            <img
              src={book.image}
              alt={`${book.title} book art`}
              className="book-cover"
            />
            <div className="book-info">
              <h4>
                <NavLink to={`/books/${book.isbn}`}>{book.title}</NavLink>
              </h4>
              <p>Category: {book.category}</p>
              <p>Classification: {book.classification}</p>
              <p>Average Rating: {book.average_rating}</p>
            </div>
          </Box>
        ))
      ) : (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '10vh', // Center vertically
          textAlign: 'center' // Center text
        }}>
          <p style={{ 
            fontSize: '24px', // Increase font size
            fontWeight: 'bold', // Make text bold
            color: '#333' // Change text color for better visibility
          }}>
            No books found.
          </p>
        </div>
      )}
    </Container>
  );
};

export default SearchResults;
