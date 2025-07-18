import React from 'react';
import Navbar from '../../Components/Navbar.jsx';
import Footer from '../../Components/Footer.jsx';
import CoverImage from '../../assets/cover-i.png';
import MainContent from '../../Components/MainContent.jsx';
import Latest from '../../Components/Latest.jsx';

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';


const Home = () => {
  return (
    <div>
      <CssBaseline enableColorScheme />
      <Navbar />
      <div style={{ flex: 1, width: '100%', overflow: 'hidden' }}>
        <img 
          src={CoverImage} 
          alt="Background" 
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </div>
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <MainContent />
        <Latest />
      </Container>
      <Footer />
    </div>
  )
}

export default Home
