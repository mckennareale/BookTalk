import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import { Container, Box } from '@mui/material'; // Import Container and Box from Material-UI
import '../css/PartialBookCard.css'; // Import the CSS file for styles

const PartialBookCard = ({ bookIds }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/books/partialInfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { book_ids: bookIds } }),
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(data => setBooks(data.data))
    .catch(err => {
      setError(err.message || 'Error fetching book details');
    })
    .finally(() => {
      setLoading(false);
    });
  }, [bookIds]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container className = "book-results-container">
      {books.map(book => (
        <Box key={book.isbn} p={2} m={2} className="book-tile">
          <img src={book.image} alt={`${book.title} book art`} className="book-cover" />
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

export default PartialBookCard;