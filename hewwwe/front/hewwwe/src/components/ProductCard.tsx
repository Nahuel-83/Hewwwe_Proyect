import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';
import '../styles/components/ProductCard.css';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="product-card"
      onClick={() => navigate(`/products/${product.productId}`)}
    >
      <CardMedia
        component="img"
        className="product-card-media"
        image={product.image || 'https://via.placeholder.com/200'}
        alt={product.name}
      />
      <CardContent className="product-card-content">
        <Typography gutterBottom variant="h6" component="h2">
          {product.name}
        </Typography>
        <Typography 
          color="text.secondary" 
          className="product-description"
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
