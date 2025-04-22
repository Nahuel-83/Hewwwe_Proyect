import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
} from '@mui/material';
import { getAllProducts } from '../../api/products';
import type { Product } from '../../types';
import { toast } from 'react-toastify';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error('Error al cargar productos');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Productos</Typography>
      
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
        {products.map((product) => (
          <Card 
            key={product.productId}
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/products/${product.productId}`)}
          >
            <CardMedia
              component="img"
              sx={{
                height: 200,
                objectFit: 'cover'
              }}
              image={product.image || 'https://via.placeholder.com/200'}
              alt={product.name}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="h2">
                {product.name}
              </Typography>
              <Typography 
                color="text.secondary" 
                sx={{ 
                  mb: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {product.description}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" color="primary">
                  {product.price}€
                </Typography>
                <Chip
                  label={product.status}
                  color={product.status === 'AVAILABLE' ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ProductsPage;