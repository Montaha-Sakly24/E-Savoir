import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Logo from '../../assets/Logo.png';

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {'© '}
      <Link color="inherit" href="#" underline="hover">
        E-Savoir
      </Link>
      {' '}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', width: '100%' }}>
      <Divider />
      <Container
        sx={{
          py: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src={Logo} alt="logo" style={{ width: 24, height: 24 }} />
          <Typography variant="subtitle1" color="primary" fontWeight="bold">
            E-Savoir
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: 'center',
          gap: { xs: 1, sm: 3 },
          textAlign: 'center'
        }}>
          <Link color="text.secondary" variant="body2" href="#" underline="hover">
            About
          </Link>
          <Link color="text.secondary" variant="body2" href="#" underline="hover">
            Contact
          </Link>
          <Link color="text.secondary" variant="body2" href="#" underline="hover">
            confidentiality
          </Link>
          <Link color="text.secondary" variant="body2" href="#" underline="hover">
            Terms
          </Link>
        </Box>

        <Copyright />
      </Container>
    </Box>
  );
}