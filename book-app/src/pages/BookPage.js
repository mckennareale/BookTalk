import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 

const BookPage = () => {
  const {bookId} = useParams(); // Get bookId from URL parameters
  const [book, setBook] = useState(null); // State for book details
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling


  

  useEffect(() => {
    
    fetch(`${process.env.REACT_APP_API_BASE}/books/full_info/${bookId}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok'); // Handle non-200 responses
      }
      return res.json(); // Parse the JSON response
    })
    .then(data => setBook(data)) // Set the book state with the fetched data
    .catch(err => {
      setError(err.message || 'Error fetching book details'); // Handle error
    })
    .finally(() => {
      setLoading(false); // Set loading to false after fetching
    });
  }, [bookId]);

  if (loading) return <div>Loading...</div>; // Loading state
  if (error) return <div>Error: {error}</div>; // Error state

  return (
    <div className="book-page-container">
      <h1 className="book-title">{book.title}</h1>
      <img src={book.image} alt={book.title} className="book-image" />
      <p className="book-description">{book.description}</p>
      <p>Authors: {book.authors.join(', ')}</p>
      <p>Publisher: {book.publisher}</p>
      <p>Published Date: {book.published_date}</p>
      <p>Category: {book.category}</p>
      <p>Average Rating: {book.avg_rating}</p>
      <p>Film Name: {book.film_name}</p>
      <p>Average Price: {book.avg_price}</p>
      <h2>Reviews:</h2>
      <ul>
        {book.reviews.map((review, index) => (
          <li key={index}>{review}</li>
        ))}
      </ul>
      <p>Classification: {book.classification}</p>
    </div>
  );
};

export default BookPage;