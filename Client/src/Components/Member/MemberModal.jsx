import React, {useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Slide
} from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MemberModal = ({
  closeModal,
  readOnly = false
}) => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
    
  return (
    <Dialog
      open
      onClose={closeModal}
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
          color="primary"
        >
          Category Details 
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Fist Name"
            fullWidth
            value={firstname}
            disabled={readOnly}
          />
          <TextField
            label="Last Name"
            fullWidth
            value={lastname}
            disabled={readOnly}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={closeModal}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default MemberModal;


