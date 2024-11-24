import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import logo from '../assets/logo.png'; // Adjust the path if necessary
import '../css/NavigationBar.css'; // Optional: Import a CSS file for styling
import { useAuth } from '../context/AuthContext';
import Button from '@mui/material/Button';

const NavigationBar = () => {
  const { logout } = useAuth();
  const handleLogOut = ()=> {
    
    logout();
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/search">Search Page</Link>
        </li>
        <li>
          <Link to="/recommendations">Recommendations</Link>
        </li>
        <li>
          <Button className="login-button" onClick={handleLogOut}>Log out</Button>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
