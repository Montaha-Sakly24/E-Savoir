import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MembersTable from '../../Components/Member/MembersTable';
import MemberModal from '../../Components/Member/MemberModal';
import { Container, Box, Button, Typography } from '@mui/material';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  const openAddModal = () => {
    setSelectedMember(null);
    setReadOnly(false);
    setShowModal(true);
  };

  const openDetailsModal = (mem) => {
    setSelectedMember(mem);
    setReadOnly(true);
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
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: { xs: 2, md: 4 }, }}>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Member Management
          </Typography>
          <Button variant="contained" color="primary" onClick={openAddModal}>
            Create
          </Button>
        </Box>

        <MembersTable
          members={selectedMember}
          onRead={openDetailsModal}
          onDelete={handleDelete}
        />

        {showModal && (
          <MemberModal
            currentMember={selectedMember}
            closeModal={closeModal}
            readOnly={readOnly}
          />
        )}
      </Container>
    </Box>
  );
};

export default MemberList;
