import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import logo from '../assets/logo.png'; // Adjust the path if necessary
import '../css/NavigationBar.css'; // Optional: Import a CSS file for styling

const NavigationBar = () => {
  return (
    <nav className="navbar">
      <img src={logo} alt="Logo" className="logo" />
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/search">Search Page</Link>
        </li>
        <li>
          <Link to="/recommendations">Recommendations</Link>
        </li>
        <li>
          <Link to="/login" className="login-button">Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
