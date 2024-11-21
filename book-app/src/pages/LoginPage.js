import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
// import { signInWithGooglePopup } from "../utils/firebase"
// import { useState } from "react"
// import { Container, Box, Typography } from "@mui/material";
// import OutlinedInput from '@mui/material/OutlinedInput';
// import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';
// import GoogleIcon from '@mui/icons-material/Google';
// import logo from '../pics/logo.png'



export default function LoginPage() {
//   const navigate = useNavigate();
//   const [userId, setUserId] = useState(null);

//   const handleLogin = () => {
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
//   }
//   const handleNewTrip = () => {
//     navigate("/newtrip", {state: {loggedIn: localStorage.getItem("id") !== null}})
//   }

  return(
    <div>Login Page</div>
    // <Container disableGutters maxWidth="sm" >
    //   <Box
    //     flexDirection="column"
    //     alignItems="center"
    //     sx={{
    //       pl: 2,
    //       pr: 2,
    //       pt: 3,
    //       pb: 8,
    //       bgcolor: '#cfe8fc',
    //       height: '100vh',
    //       overflow: 'auto',
    //     }}
    //   >
    //     <Box
    //       component="img"
    //       sx={{
    //         height: 350,
    //         width: 350,
    //       }}
    //       alt="The house from the offer."
    //       src={logo}
    //     />
    //     <Typography variant="h1">Navigator</Typography>
    //     <Typography variant="h2" mt={1}>the world is waiting</Typography>
    //     <br></br>
    //     <Stack direction="column" spacing={2} mt={6}>
    //       <Button variant="contained" size="large" onClick={handleNewTrip}>Create a new trip</Button>
    //       <Button variant="outlined" size="large" startIcon={<GoogleIcon />} onClick={handleLogin}>Login with Google</Button>
    //     </Stack>

    //     </Box>
    // </Container>
  );
}
