import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)'
        }
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
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
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
        <Box sx={{ 
          mt: 'auto',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Typography variant="h6" color="primary">
            {product.price.toLocaleString('es-ES', { 
              style: 'currency', 
              currency: 'EUR'
            })}
          </Typography>
          <Chip
            label={product.status}
            color={
              product.status === 'AVAILABLE' ? 'success' :
              product.status === 'SOLD' ? 'error' : 'warning'
            }
            size="small"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
