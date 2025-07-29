import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Slide
} from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RejectionDialog = ({ open, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim());
      setReason('');
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 3,
          background: '#ffffff',
          boxShadow: '0 12px 32px rgba(31, 38, 135, 0.15)'
        }
      }}
    >
      <DialogTitle>
        <Typography
          variant="h5"
          textAlign="center"
          fontWeight="bold"
          color="error"
        >
          Reject Article
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body1" color="textSecondary">
            Please provide a reason for rejecting this article.
          </Typography>
          <TextField
            label="Rejection Reason"
            multiline
            minRows={4}
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            autoFocus
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={!reason.trim()}
          sx={{ textTransform: 'none' }}
        >
          Reject Article
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectionDialog;
