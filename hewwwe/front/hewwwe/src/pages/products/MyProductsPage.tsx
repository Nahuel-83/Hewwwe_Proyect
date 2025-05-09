import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getUserProducts } from '../../api/users';
import { deleteProduct } from '../../api/products';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import type { Product } from '../../types';

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      const response = await getUserProducts(user!.userId);
      setProducts(response.data);
    } catch (error) {
      toast.error('Error al cargar productos');
    }
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await deleteProduct(productId);
      toast.success('Producto eliminado correctamente');
      loadProducts();
    } catch (error) {
      toast.error('Error al eliminar el producto');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Mis Productos</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/products/new')}
        >
          Nuevo Producto
        </Button>
      </Box>

      <Box 
        display="flex" 
        flexWrap="wrap" 
        gap={3}
      >
        {products.map((product) => (
          <Box 
            key={product.productId}
            width={{ xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(33.333% - 24px)' }}
          >
            <Card className="card-hover">
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography color="primary" variant="subtitle1">
                  {product.price}€
                </Typography>
                <Chip
                  label={product.status}
                  color={
                    product.status === 'AVAILABLE' ? 'success' :
                    product.status === 'RESERVED' ? 'warning' : 'error'
                  }
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
              <CardActions>
                <IconButton 
                  onClick={() => navigate(`/products/${product.productId}/edit`)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  color="error"
                  onClick={() => {
                    if (product.productId !== undefined) {
                      handleDelete(product.productId);
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
