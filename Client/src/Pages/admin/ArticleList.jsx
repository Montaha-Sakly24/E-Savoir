import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ArticlesTable from '../../Components/Article/ArticlesTable';
import RejectionDialog from '../../Components/Article/RejectionDialog';
import { Container, Box, Button, Typography, Snackbar, Alert } from '@mui/material';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [snackbar, setSnackbar] = useState({
      open: false,
      message: '',
      severity: 'success'
    }); 

  const navigate = useNavigate(); 
  
  const openDetailsPage = (article) => {
    navigate(`/admin/articles/${article._id}`);
  };

  const openRejectDialog = (id) => {
    setSelectedArticleId(id);
    setRejectDialogOpen(true);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchArticle = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:5000/api/articles/list',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setArticles(data.articles);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, []);

  const handleApprove = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/articles/${id}/approve`,
        { status: 'published',},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        showSnackbar('Article approved successfully!');
        fetchArticle();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleConfirmReject = async (reason) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/articles/${selectedArticleId}/reject`,
        { reason, status: 'rejected' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        showSnackbar('Article rejected successfully!');
        setRejectDialogOpen(false);
        setSelectedArticleId(null);
        fetchArticle();
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/articles/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    setArticles((prev) => prev.filter((c) => c._id !== id));
    showSnackbar('Article deleted successfully!');
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
            Article Management
          </Typography>
        </Box>

        <ArticlesTable
          articles={articles}
          onDelete={handleDelete}
          onRead={openDetailsPage}
          onApprove={handleApprove} 
          onReject={openRejectDialog}
          role="admin"
        />

        <RejectionDialog
          open={rejectDialogOpen}
          onClose={() => setRejectDialogOpen(false)}
          onConfirm={handleConfirmReject}
        />

      </Container>
    </Box>
  );
  };

export default ArticleList;
