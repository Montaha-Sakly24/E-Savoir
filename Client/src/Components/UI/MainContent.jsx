import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RssFeedRoundedIcon from '@mui/icons-material/RssFeedRounded';
import Masonry from '@mui/lab/Masonry';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SyledCard = styled(Card)(() => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  width: '100%',
  backgroundColor: 'white', 
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',

  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  },

  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
  },
}));


const SyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 16,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 16,
  },
});

export function Search({ onChange }) {

  return (
    <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Search…"
        sx={{
            flexGrow: 1,
            borderRadius: 2           
          }}
        onChange={(e) => onChange(e.target.value)}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search',
        }}
      />
    </FormControl>
  );
}


export default function MainContent() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [focusedCardIndex, setFocusedCardIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  

  const navigate = useNavigate();


  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/articles/publishedlist',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      ); 
        if (res.data.success) {
          setArticles(res.data.articles);
        } else {
          console.error("Erreur lors du fetch des articles.");
        }
      } catch (err) {
        console.error("Erreur réseau ou serveur :", err);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories/list',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      ); 
        if (res.data.success) {
          setCategories(res.data.categories);
        } else {
          console.error("Erreur lors du fetch des articles.");
        }
      } catch (err) {
        console.error("Erreur réseau ou serveur :", err);
      }
    };

    fetchCategories();
  }, []);

  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId); 
  };

  const filteredArticles = articles
    .filter(article =>
      !selectedCategory || article.categoryId?._id === selectedCategory
    )
    .filter(article => {
      const titleMatch = article.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const tagsMatch = article.tags?.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return titleMatch || tagsMatch;
    });


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div>
        <Typography variant="h1" gutterBottom>
          Blog
        </Typography>
        <Typography>Stay in the loop with the latest about our articles</Typography>
      </div>
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          flexDirection: 'row',
          gap: 1,
          width: { xs: '100%', md: 'fit-content' },
          overflow: 'auto',
        }}
      >
        <Search />
        <IconButton size="small" aria-label="RSS feed">
          <RssFeedRoundedIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          width: '100%',
          justifyContent: 'space-between',
          alignItems: { xs: 'start', md: 'center' },
          gap: 4,
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            flexDirection: 'row',
            gap: 3,
            overflow: 'auto',
          }}
        >
          <Chip onClick={() => handleCategoryClick(null)} 
            size="medium" 
            label="All categories" 
            color={selectedCategory === null ? 'primary' : 'default'} 
          />

          {categories.map((categorie, index) => (
            <Chip
              key={categorie._id || index}
              onClick={() => handleCategoryClick(categorie._id)}
              size="medium"
              label={categorie.title}
              color={selectedCategory === categorie._id ? 'primary' : 'default'}
            />
          ))}

        </Box>
        <Box >
          <Search onChange={setSearchTerm} />
        </Box>
      </Box>

      <Grid container spacing={2} columns={12}>
        <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={3}>
          {filteredArticles.map((article, index) => (
            <SyledCard
              key={article._id}
              variant="outlined"
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              tabIndex={0}
              className={focusedCardIndex === index ? 'Mui-focused' : ''}
              onClick={() => navigate(`/member/articles/${article._id}`)}
            >
              {article.coverImage && (
                <Box
                  sx={{
                    height: 230,
                    backgroundImage: `url(http://localhost:5000/uploads/${article.coverImage})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                />
              )}
              <SyledCardContent>
                <Typography variant="caption" sx={{ fontFamily: 'Inter, sans-serif'}} >{article.categoryId?.title}</Typography>
                <Typography variant="h6" sx={{ fontFamily: 'Inter, sans-serif' }}>{article.title}</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Inter, sans-serif' }} color="text.secondary">
                  {article.content.length > 40 ? `${article.content.slice(0, 40)}...` : article.content}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' , mt:2}}>
                    {article.tags?.map((tag, index) => (
                      <Chip key={index} label={tag} variant="outlined" size="small" />
                    ))}
                </Box>
                
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 5,
                  }}
                >
                  <Typography variant="caption">
                    {article.userId?.firstname} {article.userId?.lastname}
                  </Typography>
                  <Typography variant="caption">
                    {new Date(article.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>
              </SyledCardContent>
            </SyledCard>
          ))}
        </Masonry>
      </Grid>
    </Box>
  );
}