import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  AppBar, Toolbar, Box, Button, IconButton, Container,
  Divider, MenuItem, Drawer, Menu
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Badge from '@mui/material/Badge';
import EditIcon from '@mui/icons-material/Edit';

import { useAuth } from '../../context/ContextProvider';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/Logo.png';


const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(4px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: 'white',
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
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
      
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
         
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <img src={Logo} alt="logo" className="w-8 h-8" />
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, ml: 3 }}>
              {isAuthenticated ? (
                <Button component={Link} to={`/member/home`} color="info" size="small">
                  Home
                </Button>
              ) : (
                <Button component={Link} to="/" color="info" size="small">Home</Button>
              )}
              {isAuthenticated ? (
                <Button component={Link} to={`/member/my-articles`} color="info" size="small">
                  My Articles
                </Button>
                
              ) : (
                <Button color="info" size="small">About</Button>
              )}
              {!isAuthenticated && (
                <Button color="info" size="small">Contact</Button>
              )}
            </Box>
          </Box>

      
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
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                component={Link}
                to={`/member/articles/add`}
                sx={{ mr: 1 }}
              >
                Write
              </Button>

                <IconButton color="primary" sx={{ mr: 1 }}>
                <Badge color="error" variant="dot">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <IconButton color="primary" onClick={handleMenuOpen}>
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
          </Box>

          {/* Mobile menu icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
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
              <MenuItem component={Link} to="/member/home">Home</MenuItem>
              <MenuItem component={Link} to={`/member/my-articles`}>My Articles</MenuItem>
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
                  <IconButton component={Link} to="/write" color="primary" title="Write new article">
                    <EditNoteIcon />
                  </IconButton>

                  <IconButton color="inherit" title="Notifications">
                    <NotificationsIcon />
                  </IconButton>

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
            </Box>
          </Drawer>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
