import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { customFetch } from '../utils/customFetch';
import { useNavigate } from 'react-router-dom';

const BookPage = () => {
  const {bookId} = useParams(); // Get bookId from URL parameters
  const [book, setBook] = useState(null); // State for book details
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate();
  

  useEffect(() => {

    const fetchBook = async () => {
      try {
        const responseJson = await customFetch(
          `${process.env.REACT_APP_API_BASE}/books/full_info/${bookId}`, 
          {}, 
          navigate);
        setBook(responseJson);
      } catch (err) {
        setError(err.message || 'Error fetching book details'); // Handle error
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
    console.log(book);
    // fetch(`${process.env.REACT_APP_API_BASE}/books/full_info/${bookId}`)
    // .then(res => {
    //   if (!res.ok) {
    //     throw new Error('Network response was not ok'); // Handle non-200 responses
    //   }
    //   return res.json(); // Parse the JSON response
    // })
    // .then(data => setBook(data)) // Set the book state with the fetched data
    // .catch(err => {
    //   setError(err.message || 'Error fetching book details'); // Handle error
    // })
    // .finally(() => {
    //   setLoading(false); // Set loading to false after fetching
    // });

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
            {book.reviews.slice(0, 6).map((review, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', margin: '10px', backgroundColor: '#251F47', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: i < review.review_score ? 'gold' : 'gray' }}>&#9733;</span>
                  ))}
                </div>
                <p style={{ marginTop: '5px' }}>{review.review_text}</p>
              </div>
            ))}
          </div>
        </div>
        
      </div>

    </div>
  );
};

export default BookPage;