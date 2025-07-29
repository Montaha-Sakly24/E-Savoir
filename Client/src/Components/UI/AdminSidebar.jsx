import * as React from 'react';
import { styled} from '@mui/material/styles';
import {
  Box, Drawer as MuiDrawer, AppBar as MuiAppBar, Toolbar,
  List, Typography, Divider, IconButton, Menu, MenuItem,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Avatar
} from '@mui/material';
import { useAuth } from '../../context/ContextProvider';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import Logo from '../../assets/Logo.png';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import ClassRoundedIcon from '@mui/icons-material/ClassRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';

import Badge from '@mui/material/Badge';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const drawerBgColor = 'linear-gradient(to bottom, #1976d2, #ffffff)';
const drawerTextColor = '#ffffffff'; 
const drawerHoverBg = '#ffffffc0'; 
 

const openedMixin = (theme, drawerWidth) => ({
  width: drawerWidth,
  backgroundColor: drawerBgColor,
  color: drawerTextColor,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  backgroundColor: drawerBgColor,
  color: drawerTextColor,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `60px`,
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open, drawerWidth }) => ({
  backgroundColor: '#1976d2',
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open, drawerWidth }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme, drawerWidth),
    '& .MuiDrawer-paper': openedMixin(theme, drawerWidth),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const navItems = [
  { text: 'Dashboard', icon: <DashboardRoundedIcon />, path: '/admin/dashboard' },
  { text: 'Members List', icon: <PeopleAltRoundedIcon />, path: '/admin/members-list' },
  { text: 'Categories List', icon: <ClassRoundedIcon />, path: '/admin/categories-list' },
  { text: 'Articles List', icon: <DescriptionRoundedIcon />, path: '/admin/articles-list' },
  { text: 'Notifications List', icon: <NotificationsRoundedIcon />, path: '/admin/notifications-list' },
];

export default function AdminSidebar({ open, toggleDrawer, drawerWidth }) {

  const [menuAnchor, setMenuAnchor] = React.useState(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const handleMenuOpen = (e) => setMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  

  return (
    <>
      <AppBar position="fixed" open={open} drawerWidth={drawerWidth}>
        <Toolbar>
          <IconButton color="inherit" onClick={toggleDrawer} edge="start" sx={{ marginRight: 2 }}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
  <img src={Logo} alt="logo" style={{ width: 32, height: 32 }} />
  <Typography
    variant="h6"
    sx={{
      fontWeight: 'bold',
      fontSize: '1.2rem',
      letterSpacing: 1,
      fontFamily: 'Poppins, sans-serif',
    }}
  >
    E-Savoir
  </Typography>
</Box>
        

            <IconButton color="inherit" sx={{ mr: 1 }}>
                <Badge color="error" variant="dot">
                  <NotificationsIcon />
                </Badge>
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
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open} drawerWidth={drawerWidth} 
      sx={{
          '& .MuiDrawer-paper': {
            background: drawerBgColor,
            color: '#fff',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
          },
        }}>
        <DrawerHeader />
        <Divider sx={{ borderColor: '#475569' }} />

        <List sx={{ flexGrow: 1 }}>
          {navItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.text}
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? '#000000ff' : drawerTextColor,
              })}
            >
              <Tooltip title={open ? '' : item.text} placement="right">
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: drawerHoverBg,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        color: 'inherit',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{ opacity: open ? 1 : 0 }}
                      primaryTypographyProps={{ fontSize: 14 }}
                    />
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            </NavLink>
          ))}
        </List>
      </Drawer>
    </>
  );
}
