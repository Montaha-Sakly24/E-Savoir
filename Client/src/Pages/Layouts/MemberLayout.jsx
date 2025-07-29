import Box from '@mui/material/Box';
import Navbar from '../../Components/UI/Navbar.jsx';
import Footer from '../../Components/UI/Footer.jsx';
import { Outlet } from 'react-router-dom';

const MemberLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Navbar />
        <Outlet /> 
        <Footer />
      </Box>
    </Box>
  );
};

export default MemberLayout;
