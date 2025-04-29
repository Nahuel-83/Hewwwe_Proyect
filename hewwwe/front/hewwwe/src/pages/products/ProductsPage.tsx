import { useState, useEffect } from 'react';
import { Typography, Button, Card, CardMedia, CardContent, CardActions, Chip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../api/products';
import { useAuth } from '../../contexts/AuthContext';
import type { Product } from '../../types';
import { toast } from 'react-toastify';
import '../../styles/pages/ProductsPage.css';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="products-container">
      <div className="products-content">
        <div className="products-header">
          <Typography variant="h4" className="products-title">
            Productos
          </Typography>
          {isAuthenticated && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/products/new')}
              className="add-product-button"
            >
              Nuevo Producto
            </Button>
          )}
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <Card
              key={product.productId}
              className="product-card"
              onClick={() => navigate(`/products/${product.productId}`)}
            >
              <CardMedia
                component="img"
                className="product-image"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  {product.price}€
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Chip
                  label={product.status}
                  color={
                    product.status === 'AVAILABLE' ? 'success' :
                    product.status === 'RESERVED' ? 'warning' : 'error'
                  }
                  size="small"
                />
              </CardActions>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}