import React, {useEffect, useRef, useState} from "react";
import { Box, Typography } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import time_1 from "../assets/time_1.png";
import time_2 from "../assets/time_2.png";
import time_3 from "../assets/time_3.png";
import time_4 from "../assets/time_4.png";
import time_5 from "../assets/time_5.png";

const PeriodLoversSection = () => {

  const categories = [
    "Y2K and Today", 
    "Late 20th Century Grooves",
    "19th & Early 20th Century",
    "The Epochs of Empires (Medieval to Renaissance)",
    "The Ancients and Mythical Beginnings",
  ];

  const images = [time_1, time_2, time_3, time_4, time_5];

  return (
    <Box
        
        flexDirection="column"
        alignItems="center"
        sx={{
        pl: 2,
        pr: 2,
        pt: 5,
        // height: '75vh',
        overflow: 'auto',
        // backgroundColor: '#ffffff',
        }}
    >
    
    <Typography 
        variant="h2" 
        sx={{ 
        color: 'primary.main',
        
        }}>
        check out bookshelves of period experts
    </Typography>
    <Box sx={{ height: '10vh' }}></Box>

    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      sx={{
        gap: {
          xs: 2, // Small screens
          sm: 5, // Medium screens
          md: 10, // Large screens
        },
        flexWrap: "wrap", 
      }}
    >
      
      {categories.map((category, index) => 
        <Avatar 
          key={category}
          alt={category} 
          src={images[index]}
          sx={{ width: 200, height: 200 }} />
      )}
    </Box>

    <Box sx={{ height: '15vh' }}></Box>

    </Box>
  )
}

export default PeriodLoversSection
