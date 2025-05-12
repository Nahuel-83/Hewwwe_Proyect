import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  CircularProgress,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { getUserCart, removeFromCart, clearCart, checkout } from '../../api/cart';
import { getProductById } from '../../api/products';
import { getUserAddresses } from '../../api/users';
import { useAuth } from '../../contexts/AuthContext';
import type { CartResponseDTO, Product, Address } from '../../types';
import { toast } from 'react-toastify';

export default function CartPage() {
  const [cartResponse, setCartResponse] = useState<CartResponseDTO | null>(null);
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Calculate total price
  const totalPrice = cartProducts.reduce((sum, product) => sum + (product.price || 0), 0);

  // Load cart data from the backend
  const loadCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log('Loading cart for user:', user.userId);
      const response = await getUserCart(user.userId);
      console.log('Cart response:', response.data);
      setCartResponse(response.data);
      
      // If cart has product IDs, fetch their details
      if (response.data && response.data.productIds && response.data.productIds.length > 0) {
        await loadProductDetails(response.data.productIds);
      } else {
        console.log('No products in cart');
        setCartProducts([]);
      }
    } catch (error: any) {
      console.error('Error loading cart:', error);
      setError('No se pudo cargar el carrito. Por favor, inténtalo de nuevo más tarde.');
      toast.error('Error al cargar el carrito');
      setCartProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed product information for each product ID in the cart
  const loadProductDetails = async (productIds: number[]) => {
    try {
      console.log('Loading product details for IDs:', productIds);
      // Don't set loading true here as it's already set in loadCart
      // Create an array of promises for each product ID
      const productPromises = productIds.map(id => getProductById(id));
      // Wait for all promises to resolve
      const productResponses = await Promise.all(productPromises);
      // Extract the data from each response
      const products = productResponses.map(response => response.data);
      console.log('Products loaded:', products);
      // Update state with the product details
      setCartProducts(products);
    } catch (error: any) {
      console.error('Error loading product details:', error);
      setError('No se pudieron cargar los detalles de los productos.');
      toast.error('Error al cargar los detalles de los productos');
      setCartProducts([]);
    }
    // Don't set loading false here as it's handled in loadCart
  };

  // Remove a product from the cart
  const handleRemoveProduct = async (productId: number) => {
    if (!cartResponse || !user) return;
    try {
      setLoading(true);
      await removeFromCart(user.userId, productId);
      toast.success('Producto eliminado del carrito');
      await loadCart();
    } catch (error: any) {
      console.error('Error removing product:', error);
      toast.error('Error al eliminar el producto');
      setError('No se pudo eliminar el producto del carrito.');
    } finally {
      setLoading(false);
    }
  };
  
  // Clear all products from the cart
  const handleClearCart = async () => {
    if (!cartResponse || !user) return;
    try {
      setLoading(true);
      await clearCart(user.userId);
      toast.success('Carrito vaciado');
      await loadCart();
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      toast.error('Error al vaciar el carrito');
      setError('No se pudo vaciar el carrito.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenCheckout = () => {
    setCheckoutOpen(true);
    // Load user addresses when opening checkout
    if (user) {
      loadUserAddresses();
    }
  };
  
  // Function to load user addresses
  const loadUserAddresses = async () => {
    if (!user) return;
    
    try {
      const response = await getUserAddresses(user.userId);
      setUserAddresses(response.data);
      
      if (response.data.length > 0) {
        // Pre-select the first address by default
        setSelectedAddressId(response.data[0].addressId);
        setShowNewAddressForm(false);
      } else {
        // If no addresses, show the form to add a new one
        setShowNewAddressForm(true);
      }
    } catch (error) {
      console.error('Error loading user addresses:', error);
      toast.error('Error al cargar direcciones');
      setShowNewAddressForm(true);
    }
  };
  
  const handleCloseCheckout = () => {
    setCheckoutOpen(false);
  };
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Process checkout with the shipping address
  const handleCheckout = async () => {
    if (!cartResponse || !user) return;
    
    try {
      setProcessingCheckout(true);
      
      if (showNewAddressForm) {
        // Validate new address fields
        const requiredFields = ['street', 'city', 'state', 'zipCode', 'country'];
        const missingFields = requiredFields.filter(field => !address[field as keyof typeof address]);
        
        if (missingFields.length > 0) {
          toast.error(`Por favor complete todos los campos de dirección`);
          setProcessingCheckout(false);
          return;
        }
        
        // Use new address
        await checkout(user.userId, address);
      } else if (selectedAddressId) {
        // Use existing address
        await checkout(user.userId, { addressId: selectedAddressId });
      } else {
        toast.error('Por favor seleccione una dirección');
        setProcessingCheckout(false);
        return;
      }
      
      toast.success('¡Compra realizada con éxito!');
      setCheckoutOpen(false);
      
      // Reset form state
      setAddress({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      });
      setShowNewAddressForm(false);
      setSelectedAddressId(null);
      
      await loadCart(); // Reload cart (should be empty now)
    } catch (error: any) {
      console.error('Error processing checkout:', error);
      toast.error('Error al procesar la compra');
      // Keep the checkout dialog open so the user can try again
    } finally {
      setProcessingCheckout(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Mi Carrito</Typography>
        <Typography color="text.secondary">Por favor, inicia sesión para ver tu carrito</Typography>
      </Box>
    );
  }
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Mi Carrito</Typography>
        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      </Box>
    );
  }
  
  if (!loading && cartProducts.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Mi Carrito</Typography>
        <Typography color="text.secondary">Tu carrito está vacío</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => loadCart()}
          sx={{ mt: 2 }}
        >
          Recargar carrito
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Mi Carrito</Typography>
      
      <Box sx={{ mt: 2 }}>
        {cartProducts.map((product) => (
          <Card key={product.productId} sx={{ display: 'flex', mb: 2 }}>
            <CardMedia
              component="img"
              sx={{ width: 151 }}
              image={product.image || 'placeholder.jpg'}
              alt={product.name}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h6">
                  {product.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="div">
                  {product.price}€
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Talla: {product.size}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Estado: {product.status}
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                <IconButton 
                  aria-label="remove from cart" 
                  onClick={() => handleRemoveProduct(product.productId || 0)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6" color="primary">{totalPrice.toFixed(2)}€</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={handleClearCart}
            sx={{ flex: 1 }}
          >
            Vaciar carrito
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<ShoppingCartCheckoutIcon />}
            onClick={handleOpenCheckout}
            sx={{ flex: 1 }}
          >
            Realizar pedido
          </Button>
        </Box>
      </Box>
      
      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onClose={handleCloseCheckout} maxWidth="sm" fullWidth>
        <DialogTitle>Finalizar compra</DialogTitle>
        <DialogContent>
          {userAddresses.length > 0 && !showNewAddressForm ? (
            <>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                Seleccione una dirección de envío:
              </Typography>
              
              {userAddresses.map((addr) => (
                <Card 
                  key={addr.addressId} 
                  sx={{
                    mb: 2, 
                    border: selectedAddressId === addr.addressId ? '2px solid #00F0FF' : '1px solid #e0e0e0',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedAddressId(addr.addressId)}
                >
                  <CardContent>
                    <Typography variant="body1">
                      {addr.street}, {addr.number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {addr.city}, {addr.country}, {addr.postalCode}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
              
              <Button 
                variant="text" 
                onClick={() => setShowNewAddressForm(true)}
                sx={{ mb: 2 }}
              >
                Usar una nueva dirección
              </Button>
            </>
          ) : (
            <>
              {userAddresses.length > 0 && (
                <Button 
                  variant="text" 
                  onClick={() => {
                    setShowNewAddressForm(false);
                    if (userAddresses.length > 0 && !selectedAddressId) {
                      setSelectedAddressId(userAddresses[0].addressId);
                    }
                  }}
                  sx={{ mb: 2 }}
                >
                  Usar una dirección guardada
                </Button>
              )}
              
              <Typography variant="subtitle1" gutterBottom>
                Ingrese una nueva dirección de envío:
              </Typography>
              <Box sx={{ mt: 1, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2 }}>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <TextField
                    fullWidth
                    label="Calle y número"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    required
                  />
                </Box>
                <Box sx={{ gridColumn: 'span 6' }}>
                  <TextField
                    fullWidth
                    label="Ciudad"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    required
                  />
                </Box>
                <Box sx={{ gridColumn: 'span 6' }}>
                  <TextField
                    fullWidth
                    label="Provincia"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    required
                  />
                </Box>
                <Box sx={{ gridColumn: 'span 6' }}>
                  <TextField
                    fullWidth
                    label="Código postal"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleAddressChange}
                    required
                  />
                </Box>
                <Box sx={{ gridColumn: 'span 6' }}>
                  <TextField
                    fullWidth
                    label="País"
                    name="country"
                    value={address.country}
                    onChange={handleAddressChange}
                    required
                  />
                </Box>
              </Box>
            </>
          )}
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Resumen del pedido</Typography>
            <Divider sx={{ my: 1 }} />
            {cartProducts.map((product) => (
              <Box key={product.productId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>{product.name}</Typography>
                <Typography>{product.price}€</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1">Total:</Typography>
              <Typography variant="subtitle1" color="primary">{totalPrice.toFixed(2)}€</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCheckout} disabled={processingCheckout}>Cancelar</Button>
          <Button 
            onClick={handleCheckout} 
            variant="contained" 
            color="primary"
            disabled={processingCheckout}
          >
            {processingCheckout ? <CircularProgress size={24} /> : 'Confirmar pedido'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
