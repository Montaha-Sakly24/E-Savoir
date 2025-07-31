import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MembersTable from '../../Components/Member/MembersTable';
import MemberModal from '../../Components/Member/MemberModal';
import { Container, Box, Button, Typography, Snackbar, Alert } from '@mui/material';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const openDetailsModal = (cat) => {
    setSelectedMember(cat);
    setShowModal(true);
  };

  const fetchMember = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:5000/api/users/list',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMembers(data.members);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMember();
  }, []);

  const closeModal = () => setShowModal(false);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    setMembers((prev) => prev.filter((c) => c._id !== id));
    showSnackbar('Category deleted successfully!');
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: { xs: 2, md: 4 }, }}>
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
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Member Management
          </Typography>
          
        </Box>

        <MembersTable
          members={members}
          onRead={openDetailsModal}
          onDelete={handleDelete}
        />

        {showModal && (
          <MemberModal
            open={showModal}
            handleClose={closeModal}
            member={selectedMember}
          />
        )}
      </Container>
    </Box>
  );
};

export default MemberList;
