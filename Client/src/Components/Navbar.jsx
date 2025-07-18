import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import {
  AppBar, Toolbar, Box, Button, IconButton, Container,
  Divider, MenuItem, Drawer, Menu, Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AccountCircle from '@mui/icons-material/AccountCircle';

import ColorModeIconDropdown from './ColorModeIconDropdown';
import Sitemark from './SitemarkIcon';
import { useAuth } from '../context/ContextProvider';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [menuAnchor, setMenuAnchor] = React.useState(null);

  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => setDrawerOpen(open);
  const handleMenuOpen = (e) => setMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          {/* Logo + liens */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <img src={Logo} alt="logo" className="w-8 h-8" />
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, ml: 3 }}>
              <Button component={Link} to="/" color="info" size="small">Home</Button>
              <Button color="info" size="small">Features</Button>
              <Button color="info" size="small">Highlights</Button>
              <Button color="info" size="small">FAQ</Button>
            </Box>
          </Box>

          {/* Auth actions */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {!isAuthenticated ? (
              <>
                <Button component={Link} to="/login" color="primary" variant="text" size="small">
                  Sign In
                </Button>
                <Button component={Link} to="/signup" color="primary" variant="contained" size="small">
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  Hello, {user.firstname}
                </Typography>
                <IconButton color="inherit" onClick={handleMenuOpen}>
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={handleMenuClose}
                >
                  <MenuItem component={Link} to={`/${user.role}/profile`} onClick={handleMenuClose}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
            <ColorModeIconDropdown />
          </Box>

          {/* Mobile menu icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="menu" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Drawer Mobile */}
          <Drawer
            anchor="top"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            PaperProps={{ sx: { top: 'var(--template-frame-height, 0px)' } }}
          >
            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={toggleDrawer(false)}>
                  <CloseRoundedIcon />
                </IconButton>
              </Box>
              <MenuItem component={Link} to="/">Home</MenuItem>
              <MenuItem>Features</MenuItem>
              <MenuItem>Highlights</MenuItem>
              <MenuItem>FAQ</MenuItem>
              <Divider sx={{ my: 2 }} />
              {!isAuthenticated ? (
                <>
                  <MenuItem component={Link} to="/signup">
                    <Button fullWidth variant="contained" color="primary">Sign Up</Button>
                  </MenuItem>
                  <MenuItem component={Link} to="/login">
                    <Button fullWidth variant="outlined" color="primary">Sign In</Button>
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem component={Link} to={`/${user.role}/profile`}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </>
              )}
            </Box>
          </Drawer>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
