import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CircularProgress,
  Button
} from '@mui/material';
import { getCategoryById } from '../../api/categories';
import { Category } from '../../types';
import ProductCard from '../../components/ProductCard';
import { toast } from 'react-toastify';

const CategoryDetail = () => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) loadCategory(Number(id));
  }, [id]);

  const loadCategory = async (categoryId: number) => {
    try {
      setLoading(true);
      const response = await getCategoryById(categoryId);
      setCategory(response.data);
    } catch (error) {
      toast.error('Error al cargar la categoría');
      navigate('/categories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!category) return null;

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      p: { xs: 2, sm: 4 },
      maxWidth: 1400,
      mx: 'auto',
      width: '100%'
    }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {category.name}
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/categories')}>
          Volver
        </Button>
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {category.description}
      </Typography>

      <Box sx={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        '& > *': { 
          flexBasis: '300px',
          flexGrow: 1,
          maxWidth: 'calc(33.333% - 16px)',
          '@media (max-width: 900px)': {
            maxWidth: 'calc(50% - 16px)',
          },
          '@media (max-width: 600px)': {
            maxWidth: '100%',
          },
        }
      }}>
        {category.products?.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </Box>
    </Box>
  );
};

export default CategoryDetail;
