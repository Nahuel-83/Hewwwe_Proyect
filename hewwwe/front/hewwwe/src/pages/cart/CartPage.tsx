import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Divider,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { getCartById, removeProductFromCart } from '../../api/cart';
import type { Cart } from '../../types';
import { toast } from 'react-toastify';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const userId = 1; // Esto debería venir de tu sistema de autenticación

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await getCartById(userId);
      setCart(response.data);
    } catch (error) {
      toast.error('Error al cargar el carrito');
    }
  };

  const handleRemoveProduct = async (productId: number) => {
    try {
      if (cart) {
        await removeProductFromCart(cart.cartId, productId);
        loadCart();
        toast.success('Producto eliminado del carrito');
      }
    } catch (error) {
      toast.error('Error al eliminar producto del carrito');
    }
  };

  const calcularTotal = () => {
    if (!cart?.products) return 0;
    return cart.products.reduce((total, product) => total + product.price, 0);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Mi Carrito</Typography>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: '2' }}>
          {cart?.products?.map((product) => (
            <Card key={product.productId} sx={{ mb: 2 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 100, height: 100, bgcolor: 'grey.200' }}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography color="textSecondary">{product.description}</Typography>
                  <Typography variant="h6" color="primary">{product.price}€</Typography>
                </Box>
                <IconButton onClick={() => handleRemoveProduct(product.productId)}>
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Card sx={{ flex: '1', height: 'fit-content' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Resumen del pedido</Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Total:</Typography>
              <Typography variant="h6">{calcularTotal()}€</Typography>
            </Box>
            <Button variant="contained" fullWidth>
              Proceder al pago
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
