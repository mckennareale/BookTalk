import React, {useEffect, useRef, useState} from "react";
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
import dayjs from 'dayjs';
import Alert from '@mui/material/Alert';
import logo from '../assets/logo_color.png'; 
import countries from '../helpers/countries';


const OnboardingPage = () => {

  const [birthday, setBirthday] = useState(dayjs());
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {}

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
          // pb: 10,
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
                renderInput={(params) => <TextField {...params} label="Country" fullWidth />}
              />
            <Autocomplete
                disablePortal
                options={cities}
                onChange={(event, newValue) => setCity(newValue)}
                renderInput={(params) => <TextField {...params} label="City" fullWidth />}
              />
            
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'primary.main',
                textAlign: 'left' 
                }}>
              what have you been reading lately? </Typography>
            <TextField id="outlined-basic" label="Input 3 books you read" variant="outlined"/> 
            <br></br>

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
