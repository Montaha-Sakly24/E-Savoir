import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoriesTable from '../../Components/Category/CategoriesTable';
import CategoryModal from '../../Components/Category/CategoryModal';
import { Container, Box, Button, Typography } from '@mui/material';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  const openAddModal = () => {
    setSelectedCategory(null);
    setReadOnly(false);
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setSelectedCategory(cat);
    setReadOnly(false);
    setShowModal(true);
  };

  const openDetailsModal = (cat) => {
    setSelectedCategory(cat);
    setReadOnly(true);
    setShowModal(true);
  };

  const fetchCategory = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:5000/api/categories/list',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setCategories(data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const closeModal = () => setShowModal(false);

  const addCategory = async (title, description) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/categories/add',
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        closeModal();
        fetchCategory();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const editCategory = async (id, title, description) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/categories/${id}`,
        { id, title, description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        closeModal();
        fetchCategory();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/categories/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    setCategories((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: { xs: 2, md: 4 }, }}>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Category Management
          </Typography>
          <Button variant="contained" color="primary" onClick={openAddModal}>
            Create
          </Button>
        </Box>

        <CategoriesTable
          categories={categories}
          onEdit={openEditModal}
          onRead={openDetailsModal}
          onDelete={handleDelete}
        />

        {showModal && (
          <CategoryModal
            currentCategory={selectedCategory}
            closeModal={closeModal}
            addCategory={addCategory}
            editCategory={editCategory}
            readOnly={readOnly}
          />
        )}
      </Container>
    </Box>
  );
};

export default CategoryList;
