import React, { useEffect, useState } from 'react';
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

const CategoryModal = ({
  closeModal,
  addCategory,
  currentCategory,
  editCategory,
  readOnly = false
}) => {
  const isEditMode = !!currentCategory && !readOnly;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});


  useEffect(() => {
    if (currentCategory) {
      setTitle(currentCategory.title || '');
      setDescription(
        typeof currentCategory.description === 'string'
          ? currentCategory.description
          : currentCategory.description?.blocks?.map((b) => b.text).join('\n') || ''
      );
    } else {
      setTitle('');
      setDescription('');
    }
  }, [currentCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'The title field is required.';
    } else if (title.trim().length > 50) {
      newErrors.title = 'The title must not exceed 50 characters.';
    }

    if (!description.trim()) {
      newErrors.description = 'The description field is required.';
    } else if (description.trim().length > 300) {
      newErrors.description = 'The description must not exceed 300 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (isEditMode) {
      editCategory(currentCategory._id, title.trim(), description.trim());
    } else {
      addCategory(title.trim(), description.trim());
    }
  };



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
          {readOnly
            ? 'Category Details'
            : isEditMode
            ? 'Edit Category'
            : 'Add New Category'}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, title: '' })); 
            }}
            disabled={readOnly}
            error={!!errors.title}
            helperText={errors.title}
            
          />
          <TextField
            label="Description"
            multiline
            minRows={4}
            fullWidth
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, description: '' }));
            }}
            disabled={readOnly}
            error={!!errors.description}
            helperText={errors.description}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={closeModal}>
          Cancel
        </Button>
        {!readOnly && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ textTransform: 'none' }}
          >
            {isEditMode ? 'Update Category' : 'Add New Category'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CategoryModal;
