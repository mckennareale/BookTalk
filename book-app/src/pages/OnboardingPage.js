import React, {useEffect, useRef, useState, useCallback} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import validator from 'validator';
import { Container, Box, Typography } from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/joy/CircularProgress';
import dayjs from 'dayjs';
import Alert from '@mui/material/Alert';
import logo from '../assets/logo_color.png'; 
import countries from '../helpers/countries';
import { customFetch } from '../utils/customFetch';

const OnboardingPage = () => {

  const [birthday, setBirthday] = useState(dayjs());
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState(null);
  const [bookOptions, setBookOptions] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);

  const [error, setError] = useState(null);
  const [searchCitiesInput, setSearchCitiesInput] = useState("");
  const [searchBooksInput, setSearchBooksInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const data = {
        data: {
          book_ids: selectedBooks,
          city_id: city,
          date_of_birth: birthday
        }
      }
      await customFetch(
        `${process.env.REACT_APP_API_BASE}/users/onboard`,
        {
          method: 'POST', 
          body: JSON.stringify(data),
        },
        navigate
      );
      navigate("/"); 
    } catch (err) {
      console.log(err.message);
      setError(err.message || "Error submitting onboarding information");
      setShowErrorAlert(true);
    } 

  }

  const fetchCitiesList = useCallback(async (searchTerm) => {
    if (!country) return;

    try {
      setLoadingCities(true);
      const encodedCountry = encodeURIComponent(country);
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      const responseJson = await customFetch(
        `${process.env.REACT_APP_API_BASE}/cities/${encodedCountry}?query=${encodedSearchTerm}`,
        {},
        navigate
      );
      setCities(responseJson.cities_list || []);
    } catch (err) {
      console.log(err.message);
      setError("Error fetching list of cities");
      setShowErrorAlert(true);
    } finally {
      setLoadingCities(false);
    }
  }, [country, navigate]);

  const fetchBooksList = useCallback(async (bookSearchTerm) => {
    if (!bookSearchTerm) { return; }

    try {
      setLoadingBooks(true);
      const encodedSearchTerm = encodeURIComponent(bookSearchTerm);
      const data = {
        data: {
          title: encodedSearchTerm
        }
      }
      const responseJson = await customFetch(
        `${process.env.REACT_APP_API_BASE}/books/search`,
        {
          method: 'POST', 
          body: JSON.stringify(data),
        },
        navigate
      );
      setBookOptions(responseJson.data || []);
    } catch (err) {
      console.log(err.message);
      setError("Error fetching list of books");
    } finally {
      setLoadingBooks(false);
    }
  }, [navigate]);

  const handleSearchBooks = () => {
    if (searchBooksInput.trim() !== "") {
      setLoadingBooks(true);
      fetchBooksList(searchBooksInput);
    }
  };
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCitiesList(searchCitiesInput);
    }, 300); 
    return () => clearTimeout(timeoutId); 
  }, [searchCitiesInput, fetchCitiesList]);

  return (
    <Container 
      disableGutters 
      maxWidth="md"
      >

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center" 
        sx={{
          pl: 2,
          pr: 2,
          pt: 10,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        
        <Typography 
          variant="h2" 
          sx={{ 
            color: 'primary.main',
            textAlign: 'left'
            }}>
          hi there! welcome to book talk :)
          </Typography>
        <br></br>

        <Typography 
          variant="h4" 
          sx={{ 
            color: 'primary.main',
            textAlign: 'left'
            }}>
          tell us a bit about yourself
          </Typography>

        <Box
          display='flex'
          justifyContent="center"
          sx={{
            width: '100%', 
          }}
          >

          <Stack 
            direction="column" 
            spacing={4} 
            mt={5}
            sx={{
              minWidth: 600, 
            }}>

            <Typography 
              variant="h4" 
              sx={{ 
                color: 'primary.main',
                textAlign: 'left' 
                }}>
                what is your birthday? 
              </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker 
                label="date of birth"
                value={birthday}
                onChange={(newValue) => setBirthday(newValue)}/>
            </LocalizationProvider>

            <Typography 
              variant="h4" 
              sx={{ 
                color: 'primary.main',
                textAlign: 'left' 
                }}>
              where are you in the world? 
            </Typography>
            <Autocomplete
                disablePortal
                options={countries}
                onChange={(event, newValue) => setCountry(newValue)}
                renderInput={(params) => <TextField {...params} label="country" fullWidth />}
              />

            {country && (
              <Autocomplete
                disablePortal
                options={cities}
                getOptionLabel={(option) => option.city || ""}
                isOptionEqualToValue={(option, value) => option.city_id === value.city_id} 
                loading={loadingCities}
                onInputChange={(event, newInputValue) => setSearchCitiesInput(newInputValue)}
                onChange={(event, newValue) => {setCity(newValue?.city_id || null);}}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="city"
                    fullWidth
                    slots={{
                      endAdornment: (
                        <>
                          {loadingCities ? <CircularProgress color="primary" size={20} /> : null}
                          {params.InputProps?.endAdornment || null}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}

            {/* {city && <p>Selected City ID: {city}</p>} */}

            <Typography 
              variant="h4" 
              sx={{ 
                color: 'primary.main',
                textAlign: 'left' 
                }}>
              what have you been reading lately? </Typography>
              <Autocomplete
                multiple
                disablePortal
                options={bookOptions}
                getOptionLabel={(option) => option.title || ""}
                isOptionEqualToValue={(option, value) => option.isbn === value.isbn} 
                loading={loadingBooks}
                onInputChange={(event, newInputValue, reason) => {
                  if (reason === 'input') {
                    setSearchBooksInput(newInputValue);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    
                    handleSearchBooks();
                  }
                }}
                onChange={(event, newValue) => {
                  const selectedIsbns = newValue.map(book => book.isbn);
                  setSelectedBooks(selectedIsbns);
                  setBookOptions([]);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="type and hit enter to search for books"
                    fullWidth
                    error={selectedBooks.length < 3 || selectedBooks.length > 8}
                    helperText={
                      (selectedBooks.length < 3 || selectedBooks.length > 8) 
                        ? "please select 3 to 8 books" : ""
                    }
                    slots={{
                      endAdornment: (
                        <>
                          {loadingBooks ? <CircularProgress color="primary" size={20} /> : null}
                          {params.InputProps?.endAdornment || null}
                        </>
                      ),
                    }}
                  />
                )}
              />
            <br></br>
            {/* {<p>Selected book IDs: {selectedBooks.join(', ')}</p>} */}

            <Button variant="contained" size="large" onClick={handleSubmit}>enter your library</Button>
            
            {showErrorAlert && (
              <Alert variant="outlined" severity="error">
                {error}
              </Alert>
            )}
          </Stack>
        </Box>

      </Box>
    </Container>

  )
}

export default OnboardingPage
