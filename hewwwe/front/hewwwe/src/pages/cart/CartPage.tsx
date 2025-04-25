import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUserCart, removeProductFromCart } from '../../api/cart';
import type { Cart } from '../../types';
import { toast } from 'react-toastify';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = 1; // TODO: Get from auth context

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await getUserCart(userId);
      setCart(response.data);
    } catch (error) {
      toast.error('Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (productId: number) => {
    if (!cart) return;
    try {
      await removeProductFromCart(cart.cartId, productId);
      toast.success('Producto eliminado del carrito');
      loadCart();
    } catch (error) {
      toast.error('Error al eliminar el producto');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Mi Carrito</Typography>
      {cart && cart.products && cart.products.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cart.products.map((product) => (
            <Card key={product.productId}>
              <CardContent sx={{ display: 'flex', gap: 2 }}>
                <CardMedia
                  component="img"
                  sx={{ width: 100, height: 100, objectFit: 'cover' }}
                  image={product.image}
                  alt={product.name}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography color="text.secondary">{product.description}</Typography>
                  <Typography color="primary">{product.price}€</Typography>
                </Box>
                <IconButton 
                  color="error"
                  onClick={() => handleRemoveProduct(product.productId)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Typography color="text.secondary">No hay productos en el carrito</Typography>
      )}
    </Box>
  );
}
