import React from 'react';
import BookShelf from '../components/BookShelf';
import { Box } from '@mui/material';

const HomePage = () => {
  const books = [
    { isbn: '1', image: 'book1.jpg', color: '#a44a3f' },
    { isbn: '2', image: 'book2.jpg', color: '#f19c79' },
    { isbn: '1', image: 'book1.jpg', color: '#a44a3f' },
    { isbn: '2', image: 'book2.jpg', color: '#f19c79' },
    { isbn: '1', image: 'book1.jpg', color: '#a44a3f' },
    { isbn: '2', image: 'book2.jpg', color: '#f19c79' },
    { isbn: '1', image: 'book1.jpg', color: '#a44a3f' },
    { isbn: '2', image: 'book2.jpg', color: '#f19c79' },
    // ... more books
  ];

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      <BookShelf books={books} />
    </Box>
  );
};

export default HomePage;
