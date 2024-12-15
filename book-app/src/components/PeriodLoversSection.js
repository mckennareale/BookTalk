import React, {useEffect, useState} from "react";
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import time_1 from "../assets/time_1.png";
import time_2 from "../assets/time_2.png";
import time_3 from "../assets/time_3.png";
import time_4 from "../assets/time_4.png";
import time_5 from "../assets/time_5.png";
import { customFetch } from "../utils/customFetch";
import { useNavigate } from 'react-router-dom';

const PeriodLoversSection = ({ data }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedPeriodData, setSelectedPeriodData] = useState(null);
  const [isbns, setIsbns] = useState([]);
  const [periodLovers, setPeriodLovers] = useState([]);
  const [periodData, setPeriodData] = useState([]);

  const categories = [
    "Y2K and Today", 
    "Late 20th Century Grooves",
    "19th & Early 20th Century",
    "The Epochs of Empires (Medieval to Renaissance)",
    "The Ancients and Mythical Beginnings",
  ];

  const images = [time_1, time_2, time_3, time_4, time_5];

  const handlePeriodClick = async (category) => {
    if (data && data.data) {
      const periodData = data.data.find(period => 
        period.period_type === category
      );
      console.log("Period data:", periodData);
      if (periodData) {
        setPeriodData(periodData);
        setSelectedPeriodData(periodData);
        setOpen(true);
        setIsbns(periodData.isbns);
        try {
          const responseJson = await customFetch(
            `${process.env.REACT_APP_API_BASE}/get_period_books?isbns=${periodData.isbns}`,
            { method: "GET" },
            navigate
          );
          console.log("Period books response:", responseJson);
          setPeriodLovers(Array.isArray(responseJson.data) ? responseJson.data : []);
        } catch (err) {
          console.error("Error fetching period recs:", err.message);
          setPeriodLovers([]);
        }
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPeriodData(null);
  };

  const renderPeriodDetails = () => {
    if (!selectedPeriodData) return null;

    return (
      <>
        <DialogTitle 
          id="alert-dialog-title"
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            textAlign: 'center',
            py: 3
          }}
        >
          {selectedPeriodData.period_type}
        </DialogTitle>
        <DialogContent sx={{ mt: 3, px: 4 }}>
          {Array.isArray(periodLovers) && periodLovers.length > 0 ? (
            periodLovers.map((book, index) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 3,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'primary.main',
                    mb: 1
                  }}
                >
                  {book.title}
                </Typography>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 1
                  }}
                >
                  by {book.author}
                </Typography>
                {book.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      lineHeight: 1.6
                    }}
                  >
                    {book.description.substring(0, 150)}...
                  </Typography>
                )}
              </Box>
            ))
          ) : (
            <Typography 
              variant="body1" 
              sx={{ 
                textAlign: 'center',
                color: 'text.secondary',
                py: 4
              }}
            >
              No books found for this period.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: 'background.paper' }}>
          <Button 
            onClick={handleClose} 
            variant="contained" 
            color="primary"
            sx={{
              px: 4,
              py: 1,
              borderRadius: 2
            }}
          >
            Close
          </Button>
        </DialogActions>
      </>
    );
  };

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      sx={{
        pl: 2,
        pr: 2,
        pt: 5,
        overflow: 'auto',
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
            sx={{ 
              width: 200, 
              height: 200,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
                transition: 'opacity 0.3s'
              }
            }}
            onClick={() => handlePeriodClick(category)}
          />
        )}
      </Box>

      <Box sx={{ height: '15vh' }}></Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth
      >
        {renderPeriodDetails()}
      </Dialog>
    </Box>
  )
}

export default PeriodLoversSection;
