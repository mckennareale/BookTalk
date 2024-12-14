import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const BookShelf = ({ books = [] }) => {
  const theme = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Add some test books if none are provided, with unique keys
  const testBooks = books.length > 0 ? books : [
    { isbn: 'test1', color: '#a44a3f' },
    { isbn: 'test2', color: '#f19c79' },
    { isbn: 'test3', color: '#8b4513' },
    { isbn: 'test4', color: '#a44a3f' },
    { isbn: 'test5', color: '#f19c79' },
  ];

  console.log('Books being rendered:', testBooks); // Debug log

  const getOffset = (index) => {
    if (hoveredIndex === null) return 0;
    if (index < hoveredIndex) return -60;
    if (index > hoveredIndex) return 150;
    return 0;
  };

  return (
    <Box 
      sx={{ 
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: "white",
      }}
    >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '12px', // Keep the gap between books
        height: '100%', // Make bookshelf take up more height
        width: '90%', // Increase the width
        borderBottom: '15px solid #8b4513',
        padding: '5px',
      }}
    >
        {testBooks.map((book, index) => (
          <motion.div
            key={`book-${book.isbn}-${index}`}
            initial={{ rotateY: 0 }}
            animate={{ 
              rotateY: hoveredIndex === index ? -45 : 0,
              x: getOffset(index),
              z: hoveredIndex === index ? 50 : 0
            }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            style={{
              height: '250px',
              width: '40px',
              cursor: 'pointer',
              transformOrigin: 'left center',
              backgroundColor: book.color || '#' + Math.floor(Math.random()*16777215).toString(16),
              position: 'relative',
              zIndex: hoveredIndex === index ? 2 : 1,
              perspective: '1000px',
              transformStyle: 'preserve-3d',
            }}
          >
            <Box
              component={motion.div}
              sx={{
                position: 'absolute',
                top: 0,
                left: '30px',
                height: '100%',
                width: '150px',
                backgroundImage: book.image ? `url(${book.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '2px',
                boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                backgroundColor: '#ffffff',
                opacity: hoveredIndex === index ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            />
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default BookShelf;