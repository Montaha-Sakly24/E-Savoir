import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Avatar, Typography, Stack, Chip, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const getRandomColor = () => {
  const colors = ['#f44336', '#3f51b5', '#4caf50', '#ff9800', '#9c27b0', '#00acc1'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const ProfileInfo = () => {
  const [profile, setProfile] = useState({
    firstname: '',
    lastname: '',
    email: '',
    address: '',
    education: '',
    work: '',
    role:''
  });

  const [avatarColor, setAvatarColor] = useState(getRandomColor());
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
      open: false,
      message: '',
      severity: 'success'
  });

  const showSnackbar = (message, severity = 'success') => {
      setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validate = () => {
    const newErrors = {};
    if (!profile.firstname.trim()) newErrors.firstname = 'First name is required';
    if (!profile.lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!profile.address.trim()) newErrors.address = 'Address is required';
    if (!profile.education.trim()) newErrors.education = 'Education is required';
    if (!profile.work.trim()) newErrors.work = 'Work is required';

    return newErrors;
  };

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.data && res.data.user) {
        const user = res.data.user;
        setProfile({
          firstname: user.firstname || '',
          lastname: user.lastname || '',
          email: user.email || '',
          address: user.address || '',
          education: user.education || '',
          work: user.work || '',
          role: user.role || '',
        });
      } else {
        console.warn('Unexpected response structure:', res.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  fetchProfile();
}, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: '' }));
  };
  
  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await axios.put('http://localhost:5000/api/users/me', profile, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
      });

      const res = await axios.get('http://localhost:5000/api/users/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const user = res.data.user;
      setProfile({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        address: user.address || '',
        education: user.education || '',
        work: user.work || '',
        role: user.role || '',
      });
      showSnackbar('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };


  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, gap: 14 }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={800}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Stack alignItems="center" spacing={2}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: avatarColor,
              fontSize: 36,
            }}
          >
            {profile.firstname?.[0]?.toUpperCase() || '?'}
          </Avatar>
          <Typography variant="h6">
            {profile.firstname} {profile.lastname}
          </Typography>
          {profile.role && (
            <Chip label={profile.role} color="primary" variant="outlined" />
          )}
        </Stack>

      <Box sx={{ flex: 1, minWidth: 300, maxWidth: 500}}>
        <Stack spacing={2}>
          <TextField
            label="First name"
            name="firstname"
            value={profile.firstname}
            onChange={handleChange}
            error={!!errors.firstname}
            helperText={errors.firstname}
          />
          <TextField
            label="Last name"
            name="lastname"
            value={profile.lastname}
            onChange={handleChange}
            error={!!errors.lastname}
            helperText={errors.lastname}
          />
          <TextField
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            disabled
          />
          <TextField
            label="Address"
            name="address"
            value={profile.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
          />
          <TextField
            label="Education"
            name="education"
            value={profile.education}
            onChange={handleChange}
            error={!!errors.education}
            helperText={errors.education}
          />
          <TextField
            label="Work"
            name="work"
            value={profile.work}
            onChange={handleChange}
            error={!!errors.work}
            helperText={errors.work}
          />
          <Box sx={{ textAlign: 'right' }}>
            <Button variant="contained" onClick={handleSave}>
              Save Changes
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default ProfileInfo;

