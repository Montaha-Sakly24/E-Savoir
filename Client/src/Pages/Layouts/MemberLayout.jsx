import Box from '@mui/material/Box';
import Navbar from '../../Components/UI/Navbar.jsx';
import Footer from '../../Components/UI/Footer.jsx';
import { Outlet } from 'react-router-dom';

const MemberLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f4f6f8' 
      }}
    >
      <Navbar />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: '90px', 
          px: 2,
          py: 3,
          
        }}
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
};

export default MemberLayout;
