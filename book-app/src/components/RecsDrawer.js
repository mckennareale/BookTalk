import React, { useState } from 'react';
import { Drawer, Typography, useTheme, Box } from '@mui/material';
import { useNavigate } from "react-router-dom";

const RecsDrawer = ({ open, toggleDrawer, 
    books, drawerTrigger, city, country, location_id,
    category, timePeriod }) => {
    
    const theme = useTheme();
    const navigate = useNavigate();
    let header = "";
    if (drawerTrigger === "location") {
        header = `books set in ${city}, ${country}`;
    } else if (drawerTrigger === "category") {
        header = `books in category: ${city}, ${country}`;
    } else {
        header = `books set in ${timePeriod}`;
    }
    const handleBookClick = (bookId) => {
        navigate(`/books/${bookId}`);
    };  

  
    return (
        <Drawer 
        anchor="right" 
        open={open} 
        onClose={toggleDrawer(false)}
        PaperProps={{
            sx: {
            //   backgroundColor: theme.palette.background.paper
            }
        }}
        >
        <Box
            role="presentation"
            display='flex'
            flexDirection="column"
            justifyContent="center"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
            sx={{ 
            maxWidth: "30vw", 
            minWidth: "20vw",
            padding: '20px',
            }}
        >
            <Box
                sx={{
                    textAlign: 'center',
                    // backgroundColor: '#ADD8E6', // light blue for dev
                }}>
                <Typography variant="h5">{header}</Typography>
            </Box>
            <br></br>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "15px",
                    justifyContent: "center",
                }}
            >
                {books.map((book) => (
                    <Box
                        key={book.id}
                        onClick={() => handleBookClick(book.id)}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            backgroundColor: "#FFF",
                            padding: "20px",
                            borderRadius: "10px",
                            maxWidth: "250px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <img
                            src={book.image}
                            alt={book.title}
                            style={{
                                width: "100%",
                                height: "200px",
                                objectFit: "contain",
                                marginBottom: "10px",
                            }}
                        />
                        <Typography variant="h6">{book.title}</Typography>
                        <Typography variant="subtitle1">
                            {book.authors?.join(", ")}
                        </Typography>
                        
                    </Box>
                ))}
            </Box>
        </Box>
        </Drawer>
    );
};

export default RecsDrawer;
