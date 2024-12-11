import React from 'react';
import { Box, Container, useTheme } from '@mui/material';
import recTopCategories from '../components/recTopCategories';

const RecsPage = () => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        backgroundColor: theme.palette.background.paper,
        minHeight: '100vh',
        paddingTop: '24px'
      }}
    >
      <recTopCategories />
      
      {/* We can add more section components here later */}
      
    </Box>
  );
};

export default RecsPage;
