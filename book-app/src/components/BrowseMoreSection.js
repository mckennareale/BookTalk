import React, {useEffect, useRef, useState} from "react";
import { Container, Box, Typography } from "@mui/material";

const BrowseMoreSection = () => {
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
            backgroundColor: '#ffffff',
            }}
        >
        
        <Typography 
          variant="h2" 
          sx={{ 
            color: 'primary.main',
            
            }}>
          browse more...
        </Typography>
    </Box>
  )
}

export default BrowseMoreSection
