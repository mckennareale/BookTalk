import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import { Container, Box } from '@mui/material'; // Import Container and Box from Material-UI
// import '../css/PartialBookCard.css'; // Import the CSS file for styles

const PartialBookCard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const bookIds = ["0826211062", "B000890HE2", "isbn3"];

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
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const format1 = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };

  const format2 = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    background: '#F19C79', 
    borderRadius: '16px', 
    border: '2px solid #000' 
  };


  return (
    <Container style={format1}>
      {books.map(book => (
        <Box key={book.isbn} p={3} m={2} style={format2}>
          <img src={book.image} alt={`${book.title} book art`} className="book-cover" />
          <h4>
            <NavLink to={`/books/full_info/${book.isbn}`}>{book.title}</NavLink>
          </h4>
          <p>Category: {book.category}</p>
          <p>Classification: {book.classification}</p>
          <p>Average Rating: {book.average_rating}</p>
        </Box>
      ))}
    </Container>
  );
};

export default PartialBookCard;