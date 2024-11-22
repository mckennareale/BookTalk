import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import { Container, Box } from '@mui/material'; // Import Container and Box from Material-UI
import '../css/PartialBookCard.css'; // Import the CSS file for styles

const SearchResults = ({ searchMode, title, filters }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const query =
      searchMode === 'search'
        ? JSON.stringify({ title }) // Payload for search
        : JSON.stringify(filters); // Payload for filters

        console.log(query);
    fetch(`${process.env.REACT_APP_API_BASE}/books/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: query
      }) // Correctly stringify the body

    })
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => setBooks(data.data))
      .catch((err) => {
        setError(err.message || 'Error fetching book details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchMode, title, filters]); // Re-run when mode, query, or filters change

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container className="book-results-container">
      {books.map((book) => (
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
      ))}
    </Container>
  );
};

export default SearchResults;
