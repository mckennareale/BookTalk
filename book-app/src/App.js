import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import * as React from 'react';

import '@fontsource-variable/outfit'; // Supports weights 100-900
import { ThemeProvider, createTheme } from '@mui/material/styles';


import BookPage from './pages/BookPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import RecsPage from './pages/RecsPage';
import SearchPage from './pages/SearchPage';
import NavigationBar from './components/NavigationBar';
import './css/styles.css'
import ProtectedRoute from './ProtectedRoute';
import PartialBookCard from './components/PartialBookCard';

const theme = createTheme({
  typography: {
    fontFamily: "'Outfit Variable', sans-serif",
    h1: {
      fontSize: 60,
      fontWeight: 400,
    },
    h2: {
      fontSize: 40,
      fontWeight: 400,
    },
    h3: {
      fontSize: 30,
      fontWeight: 300,
    },
    h4: {
      fontSize: 22,
      fontWeight: 400,
    },
    body1: {
      fontSize: 16,
      fontWeight: 400,
    },
    body2: {
      fontSize: 16,
      fontWeight: 300,
    },
    caption: {
      fontSize: 10,
    },
    button: {
      fontSize: 10,
      fontWeight: 600,
    },
  },
  
  palette: {
    background: {
      paper: '#FCF5EF',
    },
    text: {
      primary: '#000000',
      secondary: '#A44A3F',

    },
    primary: {
      main: '#A44A3F',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#F19C79',
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1000,
      ml: 1250, 
      lg: 1480,
      xl: 1680,
    },
  },
});

function App() {

  const location = useLocation();
  const showNavBar = location.pathname !== "/login"; // Add other paths if needed

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        {showNavBar && <NavigationBar />}
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute> 
            } />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/books/:bookId" element={
            <ProtectedRoute>
              <BookPage />
            </ProtectedRoute>
            } />
          <Route path="/search" element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
            } />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
            } />
          <Route path="/recommendations" element={
            <ProtectedRoute>
              <RecsPage />
              </ProtectedRoute>
            } />

          <Route path="/test" element={<PartialBookCard />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
