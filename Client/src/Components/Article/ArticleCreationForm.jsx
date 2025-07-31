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
  Paper, Snackbar, Alert
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
  const [errors, setErrors] = useState({});

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
    setErrors((prevErrors) => ({ ...prevErrors, coverImage: '' }));
  };

  const validateFields = () => {
    const errors = {};

    if (!title.trim()) {
      errors.title = "Title is required.";
    } else if (title.length > 120) {
      errors.title = "Title must not exceed 120 characters.";
    }

    if (!content.trim()) {
      errors.content = "Content is required.";
    }

    if (!categoryId) {
      errors.categoryId = "Category is required.";
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      const invalidTags = tagArray.filter(tag => !/^#[a-z0-9_]{2,20}$/.test(tag));
      const hasDuplicates = new Set(tagArray).size !== tagArray.length;

      if (invalidTags.length > 0) {
        errors.tags = 'Tags must follow format #tag (2-20 lowercase letters, numbers, or underscores).';
      } else if (tagArray.length > 5) {
        errors.tags = 'Maximum 5 tags allowed.';
      } else if (hasDuplicates) {
        errors.tags = 'Duplicate tags are not allowed.';
      }
    }

    if (coverImage && !/\.(jpg|jpeg|png|webp)$/i.test(coverImage.name)) {
      errors.coverImage = 'Invalid image format. Allowed: jpg, jpeg, png, webp.';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

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
        showSnackbar('Article updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/articles/add', formData, config);
        showSnackbar('Category created successfully!');
      }
      setTimeout(() => {
        navigate('/member/my-articles');
      }, 800);
    } catch (error) {
      console.error('Error submitting article:', error.response?.data || error.message);
    }
  };

  const handleCancel = () => {
    navigate('/member/my-articles');
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 6 }}>
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
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, title: '' }));
              }}
              error={!!errors.title}
              helperText={errors.title}
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
              {errors.coverImage && (
                <Typography variant="caption" color="error">
                  {errors.coverImage}
                </Typography>
              )}

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
              onChange={(e) => {
                setContent(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, content: '' }));
              }}
              error={!!errors.content}
              helperText={errors.content}
            />

            <TextField
              label="Tags (e.g. #tech, #node)"
              fullWidth
              value={tags}
              onChange={(e) => {
                setTags(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, tags: '' }));
              }}
              helperText={errors.tags || "Comma-separated values (e.g. #AI, #React)"}
              error={!!errors.tags}
            />

            <FormControl fullWidth  error={!!errors.categoryId}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={categoryId}
                label="Category"
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setErrors((prevErrors) => ({ ...prevErrors, categoryId: '' }));
                }}
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
              {errors.categoryId && (
    <Typography variant="caption" color="error">
      {errors.categoryId}
    </Typography>
  )}
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
