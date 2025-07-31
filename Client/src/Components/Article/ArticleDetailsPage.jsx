import React, { useEffect, useState } from 'react';
import {
  Paper, Box, Typography, Button, Divider, Avatar, Chip, Stack, Grid
} from '@mui/material';
import { Alert } from '@mui/material';
import { FaHeart, FaComment } from 'react-icons/fa';

import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/ContextProvider';

const ArticleDetailsPage = () => {
  const { id } = useParams(); 
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
 
const userId = user?._id || user?.id;

    const statusColors = {
        draft: 'grey',
        pending: 'orange',
        published: 'green',
        rejected: 'red',
        amended: 'blue',
    };

  const fetchArticle = async (id) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/articles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setArticle(data.article);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
      if (id) fetchArticle(id);
  }, [id]);

  const handlePublish= async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/articles/${article._id}/submit`,
        { status: 'pending', },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        fetchArticle(id);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading || !article) return <Typography>Loading...</Typography>;
  if (!article) return <Typography>Article not found </Typography>;

  return (
    
    <Paper
      elevation={3}
      sx={{
        maxWidth: 1150,
        mx: 'auto',
        my: 2,
        p: 6,
        borderRadius: 3,
        boxShadow: 4,
        overflow: 'hidden',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" pb={1} mb={2} borderBottom={1} borderColor="black">
        <Typography variant="subtitle1" >
            {article.categoryId?.title}
        </Typography>

        <Box display="flex" alignItems="center" gap={3}>
          <Typography
            variant="body2"
            sx={{ textTransform: 'capitalize', color: statusColors[article.status] }}
          >
            {article.status}
          </Typography>

          {['draft', 'amended'].includes(article.status) &&
           userId?.toString() === article.userId?._id?.toString() && (
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handlePublish}
            >
              Publish
            </Button>
          )}
        </Box>
      </Box>

      {article.status === 'rejected' && article.rejectionReason && (
        <Box display="flex" justifyContent="center" mb={3}>
          <Alert severity="error" sx={{ width: 'fit-content', px: 6 }}>
            Rejection reason: {article.rejectionReason}
          </Alert>
        </Box>
      )}

      <Typography variant="h4" fontWeight="bold" align="center" my={3} sx={{ wordBreak: 'break-word', whiteSpace: 'normal' }} >
        {article.title}
      </Typography>

      <Grid container justifyContent="space-between" alignItems="center" py={1} borderBottom={1} borderColor="divider">
        <Grid >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar>{article.userId?.firstname?.[0]}</Avatar>
            <Typography variant="body1">
              {article.userId?.firstname} {article.userId?.lastname}
            </Typography>
            <Button variant="outlined" size="small" color="primary" sx={{ ml: 2 }}>
              Follow
            </Button>
          </Stack>
        </Grid>
        <Grid >
          <Typography variant="body2" color="text.secondary">
            {new Date(article.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Grid>
      </Grid>

      {article.status === 'published' && (
        <Box
          display="flex"
          justifyContent="flex-start"
          gap={5}
          py={2}
          borderBottom={1}
          borderColor="divider"
        >
          <Box display="flex" alignItems="center" gap={1}>
            <FaHeart color='red' size={16} />
            <Typography variant="body2">20k</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <FaComment color='#8f8e8eff' size={16} />
            <Typography variant="body2">4k</Typography>
          </Box>
        </Box>
      )}

      {article.coverImage && (
        <Box
          sx={{
            height: 300,
            my: 8,
            backgroundImage: `url(http://localhost:5000/uploads/${article.coverImage})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#999',
            transform: 'scale(1.2)',
            transformOrigin: 'center',
          }}
        />
      )}

      <Typography
        variant="body1"
        color="black"
        sx={{
          my: 4,
          whiteSpace: 'pre-line',
          wordBreak: 'break-word',
        }}
      >
        {article.content}
      </Typography>

      <Box my={2}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {article.tags?.map((tag, index) => (
            <Chip key={index} label={tag} variant="outlined" size="small" />
          ))}
        </Stack>
      </Box>

      <Divider sx={{ my: 2 }} />
     {article.status === 'published' && (
      <Box
        display="flex"
        justifyContent="flex-start"
        gap={5}
        py={2}
        borderBottom={1}
        borderColor="divider"
      >
        <Box display="flex" alignItems="center" gap={1}>
          <FaHeart color='red' size={16} />
          <Typography variant="body2">20k</Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <FaComment color='#8f8e8eff' size={16} />
          <Typography variant="body2">4k</Typography>
        </Box>
      </Box>
    )}

    </Paper>
  );
};

export default ArticleDetailsPage;
