import React, {useEffect, useRef, useState} from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const OtherReadersLoveSection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userBooks = [
    {id:'0004112563',title:'The Complete Farmhouse Kitchen Cookbook', image:'http://books.google.com/books/content?id=qZ7iAAAAC…J&printsec=frontcover&img=1&zoom=1&source=gbs_api',preview_link:'http://books.google.com/books?id=qZ7iAAAACAAJ&dq=T…armhouse+Kitchen+Cookbook&hl=&cd=1&source=gbs_api'},
    {id:'0028616693',title:"Frommer's Scotland (Frommer's Complete Guides)",image:null,preview_link:null},
    {id:'0198184743',title:'To Ireland, I (Clarendon Lectures in English Literature)',image:'http://books.google.com/books/content?id=VpCg-WGLN…=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',preview_link:'http://books.google.nl/books?id=VpCg-WGLNjcC&print…es+in+English+Literature)&hl=&cd=1&source=gbs_api'},
    {id:'0271028645',title:"Building Little Italy: Philadelphia's Italians Before Mass Migration",image:'http://books.google.com/books/content?id=0JZJgEabb…=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',preview_link:'http://books.google.com/books?id=0JZJgEabbfMC&prin…ans+Before+Mass+Migration&hl=&cd=1&source=gbs_api'},
    {id:'0345362535',title:'No Idle Hands: The Social History of American Knitting',image:'http://books.google.com/books/content?id=8dFMltjhi…=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',preview_link:'http://books.google.com/books?id=8dFMltjhi0YC&prin…tory+of+American+Knitting&hl=&cd=1&source=gbs_api'},
    {id:'0756609135',title:'Sweden (Eyewitness Travel Guides)',image:'http://books.google.com/books/content?id=CebEDwAAQ…=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',preview_link:'http://books.google.com/books?id=CebEDwAAQBAJ&prin…Eyewitness+Travel+Guides)&hl=&cd=1&source=gbs_api'},
  ];
  const handleBookClick = (bookId) => {
      navigate(`/books/${bookId}`);
  };  

  return (
    <Box
        flexDirection="column"
        alignItems="flex-start"
        sx={{
        pl: 2,
        pr: 2,
        pt: 5,
        // pb: 10,
        overflow: 'auto',
        // backgroundColor: '#ADD8E6',
        }}
    >
    
    <Typography 
        variant="h2" 
        sx={{ 
        color: 'primary.main',
        }}>
        other readers love these books...
    </Typography>

    <Box
      sx={{
          flex: "2.4",
          padding: "20px",
          overflowY: "auto",
      }}>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <Box>
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
  )
}

export default OtherReadersLoveSection
