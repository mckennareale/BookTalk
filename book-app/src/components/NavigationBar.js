import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import logo from '../assets/header_hgliph.png'; // Adjust the path if necessary
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

          <Link to="/" style={{ fontSize: '20px', color: 'black' }}>Home</Link>
        </li>
        <li>
          <Link to="/search" style={{ fontSize: '20px', color: 'black' }}>Search Page</Link>

        </li>
        <li>
          <Link to="/recommendations" style={{ fontSize: '20px', color: 'black' }}>Recommendations</Link>
        </li>
        <li>

          <Button className="login-button" onClick={handleLogOut}>Log out</Button>

        </li>
      </ul>
    </nav>
  );
};

//         <Link to="/login" className="login-button" style={{ fontSize: '20px', color: 'black' }}>Login</Link>
export default NavigationBar;
