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

const theme = createTheme({
  typography: {
    fontFamily: [
      'Outfit Variable',
    ].join(', '),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: 'Outfit Variable',
        },
        // You can also override global styles here (e.g., background, margin, etc.)
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/books/:bookId" element={<BookPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/recommendations" element={<RecsPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
