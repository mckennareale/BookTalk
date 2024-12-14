import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import mascot from "../assets/mascot.png";
import { customFetch } from "../utils/customFetch";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [userBooks, setUserBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchUserBooks = async () => {

          try {

              const responseJson = await customFetch(
                  `${process.env.REACT_APP_API_BASE}/users/books`,
                  { method: "GET" },
                  navigate
              );
  
              console.log("Fetched userBooks:", responseJson); // Debugging log
              setUserBooks(responseJson); // Save the books to state
          } catch (err) {
              console.error("Error fetching user books:", err.message);
              setError("Failed to load user books.");
          } finally {
              setLoading(false);
          }
      };
  
      fetchUserBooks();
  }, [navigate]);  
  
    const handleGetRecommendations = () => {
      navigate("/recommendations");
    };
    const handleBookClick = (bookId) => {
      navigate(`/books/${bookId}`);
  };  

    return (
        <Box
            sx={{
                display: "flex", // Flex container for two columns
                height: "100vh", // Full viewport height
                backgroundColor: "#F5EDE3",
            }}
        >
            {/* Column 1: Mascot and Button */}
            <Box
                sx={{
                    flex: "0.7",
                    display: "flex",
                    flexDirection: "column", // Stack mascot and button vertically
                    alignItems: "center", // Center align both items
                    justifyContent: "flex-start", // Align both items to the top
                    padding: "50px",
                    gap: "20px", // Add space between mascot and button
                }}
            >
                {/* Mascot */}
                <Box
                    component="img"
                    src={mascot}
                    alt="Mascot"
                    sx={{
                        width: "300px",
                        height: "auto",
                    }}
                />
                {/* Button */}
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleGetRecommendations}
                    sx={{
                        marginTop: "40px",
                        backgroundColor: "#A44A3F",
                        "&:hover": {
                            backgroundColor: "#872F28",
                        },
                    }}
                >
                    Get More Recommendations
                </Button>
            </Box>

            {/* Column 2: My Saved Books */}
            <Box
                sx={{
                    flex: "2.4",
                    padding: "20px",
                    overflowY: "auto",
                }}
            >
                {loading && <CircularProgress />}
                {error && <Typography color="error">{error}</Typography>}
                {!loading && !error && (
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                marginBottom: "20px",
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        >
                            My Saved Books
                        </Typography>
                        {userBooks.length === 0 ? (
                            <Typography>No books found for this user.</Typography>
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "15px",
                                    justifyContent: "center",
                                }}
                            >
                                {userBooks.map((book) => (
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
                                        <a
                                            href={book.preview_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                marginTop: "10px",
                                                color: "#A44A3F",
                                                textDecoration: "none",
                                            }}
                                        >
                                            Preview
                                        </a>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default HomePage;