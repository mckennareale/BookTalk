import React from 'react';
import { Link } from 'react-router-dom'; 
import logo from '../assets/logo_white.png'; 
import icon from '../assets/icon_white.png';
import '../css/NavigationBar.css'; 
import { useAuth } from '../context/AuthContext';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';

const NavigationBar = () => {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleLogOut = ()=> {
    logout();
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };


  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
          <Box 
            sx={{display: { xs: 'none', md: 'flex' }}}> 
          <Link to="/">
            <img 
              src={logo} 
              alt="book talk" 
              className="logo" />
          </Link>
          </Box>

          <Box 
            sx={{display: { xs: 'flex', md: 'none' }}}> 
          <Link to="/">
            <img 
              src={icon} 
              alt="book talk" 
              className="icon" />
          </Link>
          </Box>

          <Box sx={{ flexGrow: 1,  
            display: { xs: 'none', md: 'flex' },
            minWidth: { md: '100px', ml: '350px', lg: '550px', xl: '800px' },
            }}/> 
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Box sx={{ flexGrow: 1, pl: 2, pr: 2 }}> 
          <Typography variant="h4" component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: '#fff' }}>
              Home
          </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, pl: 2, pr: 2 }}> 
          <Typography variant="h4" component={Link}
            to="/search"
            sx={{ flexGrow: 1, textDecoration: 'none', color: '#fff' }}>
              Search
          </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1, pl: 2, pr: 2 }}> 
          <Typography variant="h4" component={Link}
            to="/recommendations"
            sx={{ flexGrow: 1, textDecoration: 'none', color: '#fff' }}>
              Recommendations
          </Typography>
          </Box>
          </Box>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }}} />
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography 
                  variant="h4" 
                  component={Link} 
                  to="/"
                  sx={{ textAlign: 'center', textDecoration: 'none', color: '#000' }}>
                    Home
                </Typography>
              </MenuItem>

              <MenuItem onClick={handleCloseNavMenu}>
              <Typography 
                  variant="h4" 
                  component={Link} 
                  to="/search"
                  sx={{ textAlign: 'center', textDecoration: 'none', color: '#000' }}>
                    Search
                </Typography>
              </MenuItem>

              <MenuItem onClick={handleCloseNavMenu}>
                <Typography 
                  variant="h4" 
                  component={Link} 
                  to="/recommendations"
                  sx={{ textAlign: 'center', textDecoration: 'none', color: '#000' }}>
                    Recommendations
                </Typography>
              </MenuItem>
              
            </Menu>
          </Box>

          <IconButton
            onClick={handleLogOut}
            sx={{ mr: 2, color: '#fff', fontSize: 80 }}
            aria-owns={open ? 'mouse-over-popover' : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <ExitToAppIcon />
          </IconButton>
        
          <Popover
            id="mouse-over-popover"
            sx={{ pointerEvents: 'none' }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <Typography sx={{ p: 1 }}>log out</Typography>
          </Popover>

        </Toolbar>
    </AppBar>
    </Box>
  );
};

export default NavigationBar;
