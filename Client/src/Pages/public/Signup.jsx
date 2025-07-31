import React, {useState} from 'react'
import axios from 'axios';
import { Link , useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper, Grid, InputAdornment, IconButton, CircularProgress, Alert, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logo from '../../assets/Logo.png'; 


const Signup = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [education, setEducation] = useState('');
    const [work, setWork] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({
      open: false,
      message: '',
      severity: 'success'
    });

    const navigate = useNavigate();
    const showSnackbar = (message, severity = 'success') => {
      setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
      setSnackbar({ ...snackbar, open: false });
    };

    const validate = () => {
      const newErrors = {};

      if (!firstname.trim()) newErrors.firstname = 'First name is required';
      if (!lastname.trim()) newErrors.lastname = 'Last name is required';

      if (!email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[\w.-]+@gmail\.com$/.test(email)) {
        newErrors.email = 'Email must be a valid gmail address (e.g. example@gmail.com)';
      }

      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }

      if (!education.trim()) newErrors.education = 'Education is required';
      if (!work.trim()) newErrors.work = 'Work is required';
      if (!address.trim()) newErrors.address = 'Address is required';

      return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }

        setErrors({});
        setLoading(true);
        
        try {
            const res = await axios.post("http://localhost:5000/api/auth/signup", {firstname, lastname, email, password, education, work, address});
            if (res.data.success){
                showSnackbar('Account created successfully!');
                setTimeout(() => {
                  navigate("/login");
                }, 800);
            }
        } catch (error) {
            setLoading(false);
            const message = error?.response?.data?.message;

            if (message === 'User already exist') {
              setErrors((prev) => ({ ...prev, email: 'This email is already registered' }));
            }   
        }
    }

  return (
    <Box
              sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                px: 2,
              }}
            >
              <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
                  {snackbar.message}
                </Alert>
              </Snackbar>
              <Box
                sx={{
                  width: '40%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  pr: 20, 
                }}
              >
                <img
                  src={logo}
                  alt="logo"
                  style={{
                    maxWidth: '350px',
                    width: '90%',
                  }}
                />
              </Box>
    
              <Box
                sx={{
                  width: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start', 
                  pr: 20, 
                }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    p: 3,
                    width: '490px',
                    borderRadius: 4,
                    boxShadow: '0 12px 32px rgba(31, 38, 135, 0.15)',
                  }}
                >
                <Box textAlign="center" sx={{mb: 2}} >
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                    }}
                  >
                      Create an account
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enter your details to continue
                  </Typography>
                </Box>
    
                <Box component="form" onSubmit={handleSubmit} >
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          margin="normal"
                          fullWidth
                          id="firstname"
                          label="First Name"
                          name="firstname"
                          value={firstname}
                          onChange={(e) => {
                            setFirstname(e.target.value);
                            setErrors((prev) => ({ ...prev, firstname: '' })); 
                          }}
                          error={!!errors.firstname}
                          helperText={errors.firstname}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          margin="normal"
                          fullWidth
                          id="lastname"
                          label="Last Name"
                          name="lastname"
                          value={lastname}
                          onChange={(e) => {
                            setLastname(e.target.value);
                            setErrors((prev) => ({ ...prev, lastname: '' })); 
                          }}
                          error={!!errors.lastname}
                          helperText={errors.lastname}
                        />
                      </Grid>
                    </Grid>


                  <TextField
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: '' })); 
                    }}
                    error={!!errors.email}
                    helperText={errors.email}
                    
                  />

                  <TextField
                    margin="normal"
                    fullWidth
                    id="address"
                    label="Address"
                    name="address"
                    autoComplete="address"
                    autoFocus
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setErrors((prev) => ({ ...prev, address: '' })); 
                    }}
                    error={!!errors.address}
                    helperText={errors.address}
                  />
                  
                  <TextField
                    margin="normal"
                    fullWidth
                    id="work"
                    label="Work"
                    name="work"
                    autoComplete="work"
                    autoFocus
                    value={work}
                    onChange={(e) => {
                      setWork(e.target.value);
                      setErrors((prev) => ({ ...prev, work: '' })); 
                    }}
                    error={!!errors.work}
                    helperText={errors.work}
                  />
                  
                  <TextField
                    margin="normal"
                    fullWidth
                    id="education"
                    label="Education"
                    name="education"
                    autoComplete="education"
                    autoFocus
                    value={education}
                    onChange={(e) => {
                      setEducation(e.target.value);
                      setErrors((prev) => ({ ...prev, education: '' })); 
                    }}
                    error={!!errors.education}
                    helperText={errors.education}
                  />
    
                  <TextField
                    margin="normal"
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: '' })); 
                    }}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
    
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      mt: 2,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1rem',
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                  </Button>
    
                  <Box textAlign="center" mt={2}>
                    <Typography variant="body2" color="text.secondary">
                       Already have an account?{' '}
                      <Link
                        to="/login"
                        style={{
                          color: '#1976d2',
                          textDecoration: 'none',
                          fontWeight: 500,
                        }}
                      >
                        Login 
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
  )
}

export default Signup
