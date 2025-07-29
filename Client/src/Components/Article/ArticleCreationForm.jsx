import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Stack,
  Paper
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ArticleCreationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories/list', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCategories(res.data.categories);
      } catch (err) {
        console.error('Error fetching categories', err);
      }
    };
    fetchCategories();
  }, []);


  useEffect(() => {
  const fetchArticle = async () => {
    if (!isEditMode) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const article = res.data.article;
      setTitle(article.title || '');
      setContent(article.content || '');
      setTags(article.tags?.join(', ') || '');
      setCategoryId(article.categoryId?._id || '');

      if (article.coverImage) {
        setPreview(`http://localhost:5000/uploads/${article.coverImage}`);
      }
    } catch (err) {
      console.error('Error loading article', err);
    }
  };

  if (categories.length > 0) {
    fetchArticle();
  }
}, [id, isEditMode, categories]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    const tagsArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    formData.append('tags', JSON.stringify(tagsArray));
    formData.append('categoryId', categoryId);
    if (coverImage) formData.append('coverImage', coverImage);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      if (isEditMode) {
        await axios.put(
          `http://localhost:5000/api/articles/${id}`,
          formData,
          config
        );
      } else {
        await axios.post('http://localhost:5000/api/articles/add', formData, config);
      }

      navigate('/member/my-articles');
    } catch (error) {
      console.error('Error submitting article:', error.response?.data || error.message);
    }
  };

  const handleCancel = () => {
    navigate('/member/my-articles');
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 6 }}>
      <Paper elevation={3} sx={{ maxWidth: 1000, mx: 'auto', p: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={4} color="primary">
          {isEditMode ? 'Edit Article' : 'Create New Article'}
        </Typography>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Stack spacing={3}>
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <Box>
              <InputLabel sx={{ mb: 1 }}>Cover Image</InputLabel>
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
              >
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>

              {preview && (
                <Box
                  component="img"
                  src={preview}
                  alt="Preview"
                  sx={{
                    width: '100%',
                    maxHeight: 300,
                    objectFit: 'contain',
                    mt: 1,
                    borderRadius: 2,
                  }}
                />
              )}
            </Box>

            <TextField
              label="Content"
              multiline
              rows={6}
              fullWidth
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />

            <TextField
              label="Tags (e.g. #tech, #node)"
              fullWidth
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              helperText="Comma-separated values (e.g. #AI, #React)"
            />

            <FormControl fullWidth required>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={categoryId}
                label="Category"
                onChange={(e) => setCategoryId(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                    },
                  },
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 2,
              }}
            >
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                {isEditMode ? 'Update Article' : 'Create Article'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default ArticleCreationForm;
