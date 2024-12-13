import React, {useEffect, useRef, useState} from "react";
import { Box, Typography } from "@mui/material";


const OtherReadersLoveSection = () => {
  return (
    <Box
        
        flexDirection="column"
        alignItems="flex-start"
        sx={{
        pl: 2,
        pr: 2,
        pt: 5,
        // pb: 10,
        height: '75vh',
        overflow: 'auto',
        backgroundColor: '#ADD8E6',
        }}
    >
    
    <Typography 
        variant="h2" 
        sx={{ 
        color: 'primary.main',
        
        }}>
        other readers love these books...
    </Typography>
    </Box>
  )
}

export default OtherReadersLoveSection
