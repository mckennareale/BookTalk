import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { customFetch } from "../utils/customFetch";
import { Typography } from "@mui/material";

const BookPage = () => {
  const { bookId } = useParams(); // Get bookId from URL parameters
  const [book, setBook] = useState(null); // State for book details
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const [selectedReview, setSelectedReview] = useState(null); // Tracks the clicked review
  const [isModalOpen, setModalOpen] = useState(false); // Tracks modal visibility

  // Fetch book data when the component mounts
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const responseJson = await customFetch(
          `${process.env.REACT_APP_API_BASE}/books/full_info/${bookId}`,
          {}
        );
        setBook(responseJson);
      } catch (err) {
        setError(err.message || "Error fetching book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  // Handle review click
  const handleReviewClick = (review) => {
    setSelectedReview(review); // Store the clicked review
    setModalOpen(true); // Open the modal
  };

  // Close modal handler
  const closeModal = () => {
    setModalOpen(false);
    setSelectedReview(null); // Clear the selected review
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Typography variant="h1" sx={{}}>
      <div
        className="book-page-container"
        style={{
          display: "flex",
          flexDirection: "column", // Stack vertically
          alignItems: "flex-start", // Align content to the left
          padding: "20px",
        }}
      >
        {/* Top Section: Image and Book Details */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            width: "100%",
            marginBottom: "40px", // Space between details and reviews
          }}
        >
          {/* Book image */}
          <div
            className="book-image-container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#F5EDE3",
              width: "350px", // Fixed width of the image slot
              height: "400px", // Fixed height of the image slot
              marginRight: "60px",
              borderRadius: "10px",
              overflow: "hidden", // Ensures no overflow outside the container
            }}
          >
            <img
              src={book.image}
              alt={book.title}
              style={{
                width: "100%", // Ensures the image takes the full width of the container
                height: "100%", // Ensures the image takes the full height of the container
                objectFit: "contain", // Preserves the aspect ratio, fits the image within the slot
                objectPosition: "center", // Centers the image within the container
              }}
            />
          </div>

          {/* Book details */}
          <div style={{ maxWidth: "800px", textAlign: "left" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{book.title}</h1>
            <p style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              {book.description}
            </p>
            <p style={{ fontSize: "1.2rem" }}>
              <strong>Authors:</strong> {book.authors.join(", ")}
            </p>
            <p style={{ fontSize: "1.2rem" }}>
              <strong>Publisher:</strong> {book.publisher}
            </p>
            <p style={{ fontSize: "1.2rem" }}>
              <strong>Published Date:</strong> {book.published_date}
            </p>
            <p style={{ fontSize: "1.2rem" }}>
              <strong>Category:</strong> {book.category}
            </p>
            {book.avg_rating && (
              <p style={{ fontSize: "1.2rem" }}>
                <strong>Average Rating:</strong> {book.avg_rating}
              </p>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div
          style={{
            width: "100%", // Full width of container
            marginLeft: "0px", // Align with the left edge of the image
            marginRight: "0px",
          }}
        >
          <Typography
            variant="h2"
            style={{ fontSize: "1.5rem", marginBottom: "20px" }}
          >
            Reviews:
          </Typography>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap", // Allow wrapping onto multiple rows
              gap: "15px", // Spacing between review cards
            }}
          >
            {book.reviews.slice(0, 12).map((review, index) => (
              <div
                key={index}
                onClick={() => handleReviewClick(review)} // Open modal on click
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#A44A3F",
                  color: "white",
                  flex: "1 1 calc(20% - 15px)", // Dynamic width: roughly 5 cards per row
                  maxWidth: "250px", // Ensure consistent card size
                  minWidth: "150px", // Minimum card size for smaller screens
                  height: "200px", // Fixed height for cards
                  overflow: "hidden",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      style={{
                        color: i < review.review_score ? "gray" : "#D3D3D3",
                        fontSize: "1rem",
                      }}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: "1.4",
                    maxHeight: "calc(200px - 50px)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 6,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {review.review_text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000, // Ensure modal is on top
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "500px",
              width: "80%",
              maxHeight: "80%", // Limit the height of the modal
              overflowY: "auto", // Enable vertical scrolling
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <p style={{ fontSize: "1rem", lineHeight: "1.6", textAlign: "left" }}>
              {selectedReview.review_text}
            </p>
            <button
              onClick={closeModal}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#A44A3F",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Typography>
  );
};

export default BookPage;
