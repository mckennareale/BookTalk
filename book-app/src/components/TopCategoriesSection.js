import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from '@mui/material';

const TopCategoriesSection = ({ data = [], error, loading, onCategoryClick }) => {
  const theme = useTheme();
  
  // Array of colors to cycle through
  const colors = ['#D4E09B', '#A44A3F', '#F19C79', '#CBDFBD'];

  // Function to calculate height based on text length
  const getHeightFromLength = (text) => {
    const baseHeight = 140; // minimum height
    const heightPerChar = 3; // additional height per character
    return Math.min(baseHeight + (text.length * heightPerChar), 200); // max height of 200px
  };

  return (
    <Box
      flexDirection="column"
      alignItems="flex-start"
      sx={{
        pl: 2,
        pr: 2,
        pt: 5,
        pb: 5,
      }}
    >
      <Typography 
        variant="h2" 
        sx={{ 
          color: 'primary.main',
          marginBottom: 4,
        }}
      >
        Your Top Categories
      </Typography>

      <Box 
        sx={{
          position: 'relative',
          height: '250px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: '3px',
          padding: '20px',
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          data.map((category, index) => {
            const height = getHeightFromLength(category);
            return (
              <Box
                key={`${category}-${index}`}
                onClick={() => onCategoryClick && onCategoryClick(category)}
                sx={{
                  width: '40px',
                  height: `${height}px`,
                  backgroundColor: colors[index % colors.length],
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: '2px 0 4px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',

                  // Hover effect
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '2px 8px 8px rgba(0,0,0,0.3)',
                  },

                  // Text style
                  '& > span': {
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    transform: 'rotate(180deg)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxHeight: `${height - 20}px`,
                    padding: '10px 0',
                    fontSize: '0.9rem',
                    letterSpacing: '1px',
                  }
                }}
              >
                <span>{category}</span>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default TopCategoriesSection;
