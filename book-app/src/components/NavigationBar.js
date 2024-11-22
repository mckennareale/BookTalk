import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import logo from '../assets/header_hgliph.png'; // Adjust the path if necessary
import '../css/NavigationBar.css'; // Optional: Import a CSS file for styling

const NavigationBar = () => {
  return (
    <nav className="navbar">
      <img src={logo} alt="Logo" className="logo" />
      <ul className="nav-links">
        <li>
          <Link to="/" style={{ fontSize: '20px', color: 'black' }}>Home</Link>
        </li>
        <li>
          <Link to="/search" style={{ fontSize: '20px', color: 'black' }}>Search Page</Link>
        </li>
        <li>
          <Link to="/recommendations" style={{ fontSize: '20px', color: 'black' }}>Recommendations</Link>
        </li>
        <li>
          <Link to="/login" className="login-button" style={{ fontSize: '20px', color: 'black' }}>Login</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
