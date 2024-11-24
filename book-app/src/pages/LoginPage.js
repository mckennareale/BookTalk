import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import validator from 'validator';

import { useState } from "react"
import { Container, Box, Typography } from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

import logo from '../assets/logo.png';


export default function LoginPage() {

//   const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const { login } = useAuth(); 
  const navigate = useNavigate(); 

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
        throw new Error(errData.message ); // Throw an error if the response is not ok
      }    

      const responseData = await response.json();
      login(responseData.token);
      navigate('/');
    } catch (err) {
      setError(err.message || "Something went wrong :(");
      setShowErrorAlert(true);
    }

  }

//     signInWithGooglePopup()
//       .then((result) => {
//         const userName = result.user.displayName;
//         const userEmail = result.user.email;
//         const userProfilePic = result.user.photoURL;
//         const userUid = result.user.uid;
//         localStorage.setItem("name", userName);
//         localStorage.setItem("email", userEmail);
//         localStorage.setItem("pic", userProfilePic);
//         localStorage.setItem("id", userUid);
//         setUserId(userUid);
//         console.log(userId);
//       })
//       .then(() => {
//         navigate("/home", {state: {loggedIn: true}});
//       })
//       .catch((error) => {
//         alert(error);
//       });


  const handleGoogleLogin = () => {

  }

  const handleFacebookLogin  = () => {

  }


  return(
    // <div>Login Page</div>
    <Container disableGutters maxWidth="md" >
      <Box
        flexDirection="column"
        alignItems="center"
        sx={{
          pl: 2,
          pr: 2,
          pt: 3,
          pb: 8,
          bgcolor: '#ffffff', //bdf3cb
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Box
          component="img"
          sx={{
            height: 350,
            width: 350,
          }}
          alt="Logo Here!"
          src={logo}
        />
        <Typography variant="h2">Book App Name Here</Typography>
        <Typography variant="h3" mt={1}>...tag line here...</Typography>
        <br></br>
        <Stack direction="column" spacing={2} mt={6}>
          <TextField id="outlined-basic" label="Email" variant="outlined"  onChange={handleEmailChange}/> 
          <TextField id="outlined-password-input" label="Password" type="password" onChange={handlePasswordChange}/>
          <Button variant="contained" size="large" onClick={handlePasswordLogin}>Login / Sign Up with Email & Password</Button>
          <Button variant="outlined" size="large" startIcon={<GoogleIcon />} onClick={handleGoogleLogin}>Login / Sign Up with Google</Button>
          <Button variant="outlined" size="large" startIcon={<FacebookIcon />} onClick={handleFacebookLogin}>Login / Sign Up with Facebook</Button>
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
