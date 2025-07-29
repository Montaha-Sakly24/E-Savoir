import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../Components/UI/AdminSidebar';

const drawerWidth = 240;
const collapsedWidth = 60;
const contentSpacing = 10;

const AdminLayout = () => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      <CssBaseline />

      <AdminSidebar
        open={open}
        toggleDrawer={toggleDrawer}
        drawerWidth={drawerWidth}
      />

      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          px: 4,
          py: 3,
          backgroundColor: '#f4f6f8',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
          marginLeft: open ? `${contentSpacing}px` : `${contentSpacing}px`,
          width: open
            ? `calc(100% - ${drawerWidth + contentSpacing}px)`
            : `calc(100% - ${collapsedWidth + contentSpacing}px)`,
        })}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
