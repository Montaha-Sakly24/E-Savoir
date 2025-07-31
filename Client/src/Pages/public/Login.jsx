import React, {useState} from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/ContextProvider.jsx';
import { TextField, Button, Typography, Box, Paper, InputAdornment, IconButton, CircularProgress, Alert, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import logo from '../../assets/Logo.png'; 

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});
    const [errors, setErrors] = useState({});
    const {login} = useAuth();
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

   const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setError(null);

    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[\w.-]+@gmail\.com$/.test(email)) {
      newErrors.email = 'Email must be a valid gmail address (e.g. example@gmail.com)';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      if (res.data.success) {
        login(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        showSnackbar('Login successfully!');

        setTimeout(() => {
          navigate(res.data.redirectTo);
        }, 800);
      }
    } catch (error) {
      setLoading(false);
      const message = error?.response?.data?.message;

      if (message === "User not exist") {
        setErrors({ email: "This email is not registered." });
      } else if (message === "Invalid credentials") {
        setErrors({ password: "Incorrect password." });
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };



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
              width: '40%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start', 
              pr: 20, 
            }}
          >
            <Paper
              elevation={6}
              sx={{
                p: 5,
                width: '100%',
                borderRadius: 4,
                boxShadow: '0 12px 32px rgba(31, 38, 135, 0.15)',
              }}
            >
            <Box textAlign="center" mb={4}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 1,
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your credentials to continue
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                error={Boolean(errors.email)}
                helperText={errors.email}
                sx={{ mb: 2 }}
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
                error={Boolean(errors.password)}
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
                sx={{ mb: 2 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2,
                  mb: 2,
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
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    style={{
                      color: '#1976d2',
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    );



}

export default Login
