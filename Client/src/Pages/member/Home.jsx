import React from 'react'
import MainContent from '../../Components/UI/MainContent.jsx';
import Container from '@mui/material/Container';

const Home = () => {
  return (
    <div >
      <Container
      
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', mb: 16, gap: 4 }}
      >
        <MainContent />
        
      </Container>
    </div>
  )
}

export default Home
