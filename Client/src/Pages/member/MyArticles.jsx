import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ArticlesTable from '../../Components/Article/ArticlesTable';
import { Container, Box, Button, Typography } from '@mui/material';

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate(); 

  const openCreateArticle = () => {
    navigate(`/member/articles/add`);
  };
  
  const openDetailsPage = (article) => {
    navigate(`/member/articles/${article._id}`);
  };

  const openEditArticle = (articleId) => {
    navigate(`/member/articles/edit/${articleId}`);
  };

  const fetchArticles = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:5000/api/articles/mylist',
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
    fetchArticles();
  }, []);
  
  const handlePublish= async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/articles/${id}/submit`,
        { status: 'pending', },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        fetchArticles();
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
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: { xs: 2, md: 4 }, }}>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" fontWeight="bold">
            Article Management
          </Typography>
          <Button variant="contained" color="primary" onClick={openCreateArticle}>
            Create
          </Button>
        </Box>

        <ArticlesTable
          articles={articles}
          onEdit={(article) => openEditArticle(article._id)}
          onRead={openDetailsPage}
          onDelete={handleDelete}
          onPublish={handlePublish}
          role="member"
        />

      </Container>
    </Box>
  );
};

export default MyArticles;
