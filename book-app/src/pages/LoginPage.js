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
import Alert from '@mui/material/Alert';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import logo from '../assets/logo_color.png'; 



export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const { login } = useAuth(); 
  const navigate = useNavigate(); 
  const location = useLocation();

  const tokenRetrievedRef = useRef(false);


  useEffect(() => {
    if (tokenRetrievedRef.current) {
      console.log("Token retrieval already completed.");
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('sessionId');
    const isNewUser = urlParams.get('newUser') === 'true';

    if (sessionId) {
      fetch(`${process.env.REACT_APP_API_BASE}/auth/retrieve-token?sessionId=${sessionId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to retrieve token');
          }
          return res.json();
        })
        .then(({ token, uid }) => {
          localStorage.setItem('authToken', token);
          localStorage.setItem('uid', uid);
          login(token);
          tokenRetrievedRef.current = true; 
          navigate(isNewUser ? "/onboarding" : "/loading");
        })
        .catch((err) => console.error('Error retrieving token:', err));
    }
  }, [login, navigate, location.search]);
  

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);
  }  

  const handlePasswordLogin = async () => {
    setError('');

    if (!validator.isEmail(email)) {
      setShowErrorAlert(true);
      setError('Invalid email. ');
      return;
    }

    if (password.trim() === '') {
      setShowErrorAlert(true);
      setError('Password cannot be empty. ');
      return;
    }

    const loginData = {
      email: email,
      password: password
    };

    try {
      
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE}/login/password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData)
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message ); 
      }    

      const responseData = await response.json();
      login(responseData.token);
      localStorage.setItem("uid", responseData.uid);
      
      if (responseData.newUser) {
        navigate("/onboarding");
      } else {
        // navigate("/"); 
        navigate("/loading"); 
      }
    } catch (err) {
      setError(err.message || "Something went wrong :(");
      setShowErrorAlert(true);
    }

  }

  const handleGoogleLogin = () => {
    const backendAuthUrl = `${process.env.REACT_APP_API_BASE}/login/google`;
    window.open(backendAuthUrl, "_self");
  }

  const handleFacebookLogin  = () => {
    // TO DO
  }


  return(
    <Container disableGutters maxWidth="md" >
      <Box
        flexDirection="column"
        alignItems="center"
        sx={{
          pl: 2,
          pr: 2,
          pt: 20,
          // pb: 10,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        
        <Typography 
          variant="h1" 
          sx={{ 
            color: 'primary.main',
            
            }}>
          welcome to
          <Box
            component="img"
            sx={{
              height: 80, // Adjust logo height
              width: 'auto', // Maintain aspect ratio
              marginLeft: 2, // Add space between the logo and text
            }}
            alt="book talk :)"
            src={logo}
          />
        </Typography>
        <br></br>
        <Typography variant="h3" sx={{ color: 'primary.main' }}>please log in or sign up below</Typography>
        <br></br>
        <Stack direction="column" spacing={4} mt={10}>
          <TextField id="outlined-basic" label="Email" variant="outlined"  onChange={handleEmailChange}/> 
          <TextField id="outlined-password-input" label="Password" type="password" onChange={handlePasswordChange}/>
          <Button variant="contained" size="large" onClick={handlePasswordLogin}>Login with Email & Password</Button>
          <Divider>
            <Typography variant="body2" sx={{ color: 'primary.main' }}> OR </Typography>
          </Divider>
          <Button variant="outlined" size="large" startIcon={<GoogleIcon />} onClick={handleGoogleLogin}>Login / Sign Up with Google</Button>
          {/* <Button variant="outlined" size="large" startIcon={<FacebookIcon />} onClick={handleFacebookLogin}>Login / Sign Up with Facebook</Button> */}
          {showErrorAlert && (
            <Alert variant="outlined" severity="error">
              {error}
            </Alert>
          )}
        </Stack>

      </Box>
    </Container>
  );
}
