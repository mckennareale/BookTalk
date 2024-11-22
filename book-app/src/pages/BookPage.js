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
    <div className="book-page-container" style={{ display: 'flex', alignItems: 'flex-start' }}>
      <img src={book.image} alt={book.title} className="book-image" style={{ width: '500px',height:'700px', marginRight: '60px' , marginLeft: '60px', marginTop: '60px'
       }} />
      <div>
        <h1 className="book-title" style={{ fontSize: '2rem' }}>{book.title}</h1>
        <p className="book-description" style={{ fontSize: '1.5rem' }}>{book.description}</p>
        <p style={{ textAlign: 'left', fontSize: '1.5rem' }}><strong>Authors:</strong> {book.authors.join(', ')}</p>
        <p style={{ textAlign: 'left', fontSize: '1.5rem' }}><strong>Publisher:</strong> {book.publisher}</p>
        <p style={{ textAlign: 'left', fontSize: '1.5rem' }}><strong>Published Date:</strong> {book.published_date}</p>
        <p style={{ textAlign: 'left', fontSize: '1.5rem' }}><strong>Category:</strong> {book.category}</p>
        {book.avg_rating && <p style={{ textAlign: 'left', fontSize: '1.5rem' }}><strong>Average Rating:</strong> {book.avg_rating}</p>}
        {book.film_name && book.film_name !== 'None'&&  <p style={{ textAlign: 'left', fontSize: '1.5rem' }}><strong>Film Name:</strong> {book.film_name}</p>}
        {book.avg_price && <p style={{ textAlign: 'left', fontSize: '1.5rem', fontWeight: 'bold' }}><strong>Price:</strong> ${Math.round(book.avg_price)}</p>}
        {book.classification && book.classification !== 'None' && <p style={{ textAlign: 'left', fontSize: '1.5rem', fontWeight: 'bold' }}>Classification: {book.classification}</p>}
        <h2 style={{ textAlign: 'left', fontSize: '2rem' }}><strong>Reviews:</strong></h2>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {book.reviews.map((review, index) => (
              <div key={index} style={{ flex: 1, marginRight: '20px', backgroundColor: 'beige', borderRadius: '100px', padding: '20px', width: '300px', height: '200px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>{review}</div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default BookPage;