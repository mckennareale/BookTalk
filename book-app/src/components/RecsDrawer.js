import React from 'react';
import { Drawer, Typography, Box } from '@mui/material';
import { useNavigate } from "react-router-dom";

const RecsDrawer = ({ open, toggleDrawer, books, drawerTrigger, city, country, category, timePeriod }) => {
    const navigate = useNavigate();
    
    let header = "";
    if (drawerTrigger === "location") {
        header = `books set in ${city}, ${country}`;
    } else if (drawerTrigger === "category") {
        header = `books in category: ${category}`;
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
                    width: { xs: '100%', sm: '450px' },
                    maxWidth: '100%',
                }
            }}
        >
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'background.paper',
                    padding: '20px',
                    borderBottom: 1,
                    borderColor: 'divider',
                    zIndex: 1,
                }}
            >
                <Typography 
                    variant="h6" 
                    sx={{ 
                        textAlign: 'center',
                        textTransform: 'capitalize'
                    }}
                >
                    {header}
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    padding: "20px",
                    overflowY: 'auto'
                }}
            >
                {books.map((book) => (
                    <Box
                        key={book.id}
                        onClick={() => handleBookClick(book.id)}
                        sx={{
                            display: "flex",
                            gap: "16px",
                            backgroundColor: "#FFF",
                            padding: "16px",
                            borderRadius: "8px",
                            cursor: 'pointer',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                            '&:hover': {
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                transform: 'translateY(-2px)',
                                transition: 'all 0.2s ease-in-out',
                            },
                        }}
                    >
                        <img
                            src={book.image}
                            alt={book.title}
                            style={{
                                width: "80px",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: "4px",
                            }}
                        />
                        <Box sx={{ flex: 1 }}>
                            <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                    fontWeight: 'bold',
                                    mb: 0.5 
                                }}
                            >
                                {book.title}
                            </Typography>
                            {book.authors && (
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                >
                                    {book.authors.join(", ")}
                                </Typography>
                            )}
                            {book.avg_rating && (
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                >
                                    Rating: {book.avg_rating}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                ))}
            </Box>
        </Drawer>
    );
};

export default RecsDrawer;
