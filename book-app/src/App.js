import './App.css';
import { Route, Routes } from 'react-router-dom';
import * as React from 'react';

import '@fontsource-variable/outfit'; // Supports weights 100-900
import { red } from '@mui/material/colors';
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
  },
  h1: {
    fontSize: 60,
    fontWeight: 600,
  },
  h2: {
    fontSize: 20,
    fontWeight: 400,
  },
  body1: {
    fontSize: 16,
    fontWeight: 400,
  },
  caption: {
    fontSize: 10,
  },
  button: {
    fontSize: 10,
    fontWeight: 600,
  },
  palette: {
    // background: {
    //   paper: '#FCF5EF',
    // },
    text: {
      primary: '#000000',
      // secondary: '#ffffff',
    },
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#000000',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationBar />
      <div className="App">
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
