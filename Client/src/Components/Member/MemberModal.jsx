import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Avatar,
  Typography,
  Button,
  Box,
  Grid,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const getRandomColor = () => {
  const colors = ['#f44336', '#3f51b5', '#4caf50', '#ff9800', '#9c27b0', '#00acc1'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const MemberModal = ({ open, handleClose, member }) => {
  const [avatarColor, setAvatarColor] = useState(getRandomColor());

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <DialogContent sx={{ bgcolor: "#f8f9fb", p: 8, position: 'relative' }}>
        {/* CLOSE BUTTON */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'grey.600',
          }}
        >
          <CloseIcon />
        </IconButton>

        <Grid container spacing={4} alignItems="stretch">
          {/* LEFT SIDE */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 3,
                  p: 3,
                  textAlign: "center",
                  boxShadow: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: avatarColor,
                    fontSize: 36,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  {member.firstname?.[0]?.toUpperCase() || '?'}
                </Avatar>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {member.firstname} {member.lastname}
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
                  <Button variant="contained" size="small">Follow</Button>
                  <Button variant="outlined" size="small">Message</Button>
                </Stack>
              </Box>

              <Box
                sx={{
                  mt: 3,
                  bgcolor: "white",
                  borderRadius: 3,
                  p: 2,
                  textAlign: "center",
                  boxShadow: 2,
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" mb={3}>Joined At</Typography>
                <Typography color="text.secondary">
                  {new Date(member.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* RIGHT SIDE */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 3,
                  p: 3,
                  boxShadow: 2,
                  mb: 3,
                }}
              >
                <Stack direction="row" spacing={2} mb={3} mt={2}>
                  <Typography fontWeight={600} sx={{ minWidth: 100 }}>Full Name:</Typography>
                  <Typography color="text.secondary">
                    {member.firstname} {member.lastname}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} mb={3}>
                  <Typography fontWeight={600} sx={{ minWidth: 100 }}>Email :</Typography>
                  <Typography color="text.secondary">
                    {member.email}
                  </Typography>
                </Stack>
              </Box>

              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 3,
                  p: 3,
                  boxShadow: 2,
                }}
              >
                <Stack direction="row" spacing={2} mb={3} mt={2}>
                  <Typography fontWeight={600} sx={{ minWidth: 100 }}>Education :</Typography>
                  <Typography color="text.secondary">
                    {member.education}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} mb={3}>
                  <Typography fontWeight={600} sx={{ minWidth: 100 }}>Work :</Typography>
                  <Typography color="text.secondary">
                    {member.work}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} mb={2}>
                  <Typography fontWeight={600} sx={{ minWidth: 100 }}>Address :</Typography>
                  <Typography color="text.secondary">
                    {member.address}
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default MemberModal;
