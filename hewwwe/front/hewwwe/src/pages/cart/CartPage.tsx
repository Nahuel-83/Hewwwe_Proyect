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

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await getCartById(1); // Ideally get from auth context
      setCart(response.data);
    } catch (error) {
      toast.error('Error al cargar el carrito');
    }
  };

  const handleRemoveProduct = async (productId: number) => {
    try {
      if (cart?.cartId) {
        await removeProductFromCart(cart.cartId, productId);
        await loadCart();
        toast.success('Producto eliminado del carrito');
      }
    } catch (error) {
      toast.error('Error al eliminar producto');
    }
  };

  const calculateTotal = () => {
    return cart?.products?.reduce((sum, product) => sum + product.price, 0) || 0;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Mi Carrito</Typography>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 2 }}>
          {cart?.products?.map((product) => (
            <Card key={product.productId} sx={{ mb: 2 }}>
              <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ width: 100, height: 100 }}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography color="textSecondary">{product.description}</Typography>
                  <Typography color="primary">${product.price}</Typography>
                </Box>
                <IconButton onClick={() => handleRemoveProduct(product.productId)}>
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Card sx={{ flex: 1, height: 'fit-content' }}>
          <CardContent>
            <Typography variant="h6">Resumen del Pedido</Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Total:</Typography>
              <Typography variant="h6">${calculateTotal()}</Typography>
            </Box>
            <Button variant="contained" fullWidth>
              Proceder al Pago
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
