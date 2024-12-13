import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import BookShelf from '../components/BookShelf';
import { customFetch } from "../utils/customFetch";
import { useNavigate } from "react-router-dom";


const TopCategoriesSection = () => {
  // Define your books array
  const categories = [
    { isbn: '1', image: 'book1.jpg', color: '#a44a3f' },
    { isbn: '2', image: 'book2.jpg', color: '#f19c79' },
    { isbn: '3', image: 'book3.jpg', color: '#a44a3f' },
    { isbn: '4', image: 'book4.jpg', color: '#f19c79' },
    { isbn: '5', image: 'book5.jpg', color: '#a44a3f' },
    { isbn: '6', image: 'book6.jpg', color: '#f19c79' },
    { isbn: '7', image: 'book7.jpg', color: '#a44a3f' }
  ];
  const [userCategories, setUserCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTopCategories = async () => {
        try {
            const responseJson = await customFetch(
                `${process.env.REACT_APP_API_BASE}/category_recs`,
                { method: "GET" },
                navigate
            );

            console.log("Fetched categories:", responseJson); // Debugging log
            setUserCategories(responseJson); // Save the books to state
        } catch (err) {
            console.error("Error fetching user categories:", err.message);
            setError("Failed to load user categories.");
        } finally {
            setLoading(false);
        }
    };
    fetchTopCategories();
}, [navigate]); 

  return (
    <Box
      flexDirection="column"
      alignItems="flex-start"
      sx={{
        pl: 2,
        pr: 2,
        pt: 5,
        pb: 5, // Add padding to the bottom
        backgroundColor: '#ffffff',
      }}
    >
      <Typography 
        variant="h2" 
        sx={{ 
          color: 'primary.main',
          marginBottom: 2,
        }}
      >
        New top categories you may like
      </Typography>
      <Box sx={{ height: '100%', overflow: 'hidden' }}>
        <BookShelf books={categories} />
      </Box>
    </Box>
  );
};

export default TopCategoriesSection;
