import { useState, useEffect } from 'react';
import {
  Typography,
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
import { createAddress } from '../../api/addresses';
import { useAuth } from '../../contexts/AuthContext';
import type { CartResponseDTO, Product, Address } from '../../types';
import { toast } from 'react-toastify';
import '../../styles/pages/CartPage.css';

export default function CartPage() {
  const [cartResponse, setCartResponse] = useState<CartResponseDTO | null>(null);
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
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
      const response = await getUserCart(user.userId);
      setCartResponse(response.data);
      
      // If cart has product IDs, fetch their details
      if (response.data && response.data.productIds && response.data.productIds.length > 0) {
        await loadProductDetails(response.data.productIds);
      } else {
        setCartProducts([]);
      }
    } catch (error: any) {
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
      // Verificar si hay IDs nulos o inválidos
      const validProductIds = productIds.filter(id => id !== null && id !== undefined && typeof id === 'number');
      
      // Solo cargar productos con IDs válidos
      const productPromises = validProductIds.map(id => getProductById(id));
      const productResponses = await Promise.all(productPromises);
      
      // Filtrar respuestas válidas
      const validProducts = productResponses
        .filter(response => response && response.data && response.data.productId)
        .map(response => response.data);
      
      setCartProducts(validProducts);
    } catch (error: any) {
      setError('No se pudieron cargar los detalles de los productos.');
      toast.error('Error al cargar los detalles de los productos');
      setCartProducts([]);
    }
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
      toast.error('Error al vaciar el carrito');
      setError('No se pudo vaciar el carrito.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenCheckout = () => {
    // Verificar primero que todos los productos tienen IDs válidos
    const invalidProducts = cartProducts.filter(product => !product.productId || typeof product.productId !== 'number');
    
    if (invalidProducts.length > 0) {
      toast.error('Hay productos en el carrito con datos incorrectos. Por favor, refresca la página e intenta de nuevo.');
      return;
    }
    
    setCheckoutOpen(true);
    setCheckoutError(null); // Clear any previous checkout errors
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
    
    // Verificar nuevamente que todos los productos tienen IDs válidos
    const invalidProducts = cartProducts.filter(product => !product.productId || typeof product.productId !== 'number');
    if (invalidProducts.length > 0) {
      setCheckoutError('Hay productos en el carrito con datos incorrectos. Intenta recargar la página.');
      setProcessingCheckout(false);
      return;
    }
    
    try {
      setProcessingCheckout(true);
      setCheckoutError(null); // Clear any previous errors
      
      if (showNewAddressForm) {
        // Validate new address fields
        const requiredFields = ['street', 'city', 'state', 'zipCode', 'country'];
        const missingFields = requiredFields.filter(field => !address[field as keyof typeof address]);
        
        if (missingFields.length > 0) {
          setCheckoutError(`Por favor complete todos los campos de dirección`);
          toast.error(`Por favor complete todos los campos de dirección`);
          setProcessingCheckout(false);
          return;
        }
        
        try {
          // First create the address
          const addressData = {
            ...address,
            userId: user.userId,
            number: address.street.includes(',') ? address.street.split(',')[1].trim() : "S/N",
            postalCode: address.zipCode  // Asegurarse de tener el postalCode
          };
          
          const addressResponse = await createAddress(addressData);
          
          // Then use the created address ID for checkout
          const newAddressId = addressResponse.data.addressId;
          
          // Asegurarse que el addressId es un número válido
          if (typeof newAddressId !== 'number' || isNaN(newAddressId)) {
            throw new Error('ID de dirección inválido recibido del servidor');
          }
          
          // Enviar solo el objeto con addressId como espera el backend
          await checkout(user.userId, { addressId: newAddressId });
          
        } catch (error: any) {
          // Handle specific errors
          if (error.response) {
            if (error.response.status === 500) {
              setCheckoutError('Error en el servidor. Intente de nuevo o contacte al administrador.');
            } else {
              setCheckoutError(`Error al crear la dirección: ${error.response.data.message || 'Datos inválidos'}`);
            }
          } else {
            setCheckoutError('Error de conexión al crear la dirección');
          }
          
          toast.error('Error al crear la dirección');
          setProcessingCheckout(false);
          return;
        }
      } else if (selectedAddressId) {
        // Use existing address
        try {
          const checkoutData = { addressId: selectedAddressId };
          
          // Asegurate de que addressId es un número
          if (typeof selectedAddressId !== 'number') {
            throw new Error('ID de dirección inválido');
          }
          
          await checkout(user.userId, checkoutData);
        } catch (error: any) {
          // Handle specific errors
          if (error.response) {
            if (error.response.status === 500) {
              setCheckoutError('Error en el servidor. Intente de nuevo o contacte al administrador. Detalles: ' + 
                              (error.response.data?.message || 'Error interno del servidor'));
            } else {
              setCheckoutError(`Error al procesar el pedido: ${error.response.data?.message || 'Algo salió mal'}`);
            }
          } else if (error.message) {
            setCheckoutError(`Error: ${error.message}`);
          } else {
            setCheckoutError('Error de conexión al procesar el pedido');
          }
          
          toast.error('Error al procesar la compra');
          setProcessingCheckout(false);
          return;
        }
      } else {
        setCheckoutError('Por favor seleccione una dirección');
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
      
      // Force cart to be cleared right after checkout
      try {
        if (user) {
          await clearCart(user.userId);
        }
      } catch (clearError) {
        // Ignore error
      }
      
      // Wait a short delay before reloading cart to ensure backend has time to process
      setTimeout(async () => {
        await loadCart(); // Reload cart (should be empty now)
      }, 1000);
      
    } catch (error: any) {
      // Handle specific errors
      if (error.response) {
        if (error.response.status === 500) {
          setCheckoutError('Error en el servidor. Intente de nuevo o contacte al administrador. ' + 
                          (error.response.data?.message || 'Error interno'));
        } else {
          setCheckoutError(`Error: ${error.response.data?.message || 'Algo salió mal durante el proceso de compra'}`);
        }
      } else if (error.request) {
        setCheckoutError('No se pudo conectar con el servidor. Verifique su conexión a internet.');
      } else {
        setCheckoutError(`Error: ${error.message || 'Error desconocido'}`);
      }
      
      toast.error('Error al procesar la compra');
      // Keep the checkout dialog open so the user can try again
    } finally {
      setProcessingCheckout(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="cart-container">
        <div className="cart-content">
          <div className="cart-header">
            <Typography variant="h4" className="cart-title">
              Mi Carrito
            </Typography>
          </div>
          <Typography color="text.secondary">Por favor, inicia sesión para ver tu carrito</Typography>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="cart-container">
        <div className="cart-content">
          <div className="cart-header">
            <Typography variant="h4" className="cart-title">
              Mi Carrito
            </Typography>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
            <CircularProgress />
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="cart-container">
        <div className="cart-content">
          <div className="cart-header">
            <Typography variant="h4" className="cart-title">
              Mi Carrito
            </Typography>
          </div>
          <Alert severity="error" style={{ marginTop: "16px" }}>{error}</Alert>
        </div>
      </div>
    );
  }
  
  if (!loading && cartProducts.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-content">
          <div className="cart-header">
            <Typography variant="h4" className="cart-title">
              Mi Carrito
            </Typography>
          </div>
          <div className="cart-empty">
            <Typography className="cart-empty-message">Tu carrito está vacío</Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => loadCart()}
              className="cart-continue-shopping"
            >
              Recargar carrito
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-content">
        <div className="cart-header">
          <Typography variant="h4" className="cart-title">
            Mi Carrito
          </Typography>
        </div>
        
        <div className="cart-grid">
          {cartProducts.map((product) => (
            <div key={product.productId} className="cart-item">
              <img
                className="cart-item-image"
                src={product.image || 'placeholder.jpg'}
                alt={product.name}
              />
              <div className="cart-item-content">
                <div>
                  <Typography variant="h6" className="cart-item-title">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" className="cart-item-description">
                    {product.description}
                  </Typography>
                  <Typography className="cart-item-price">
                    {product.price}€
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Talla: {product.size}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estado: {product.status}
                  </Typography>
                </div>
              </div>
              <div className="cart-item-actions">
                <IconButton 
                  aria-label="remove from cart" 
                  onClick={() => handleRemoveProduct(product.productId || 0)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <Typography className="cart-summary-title">Resumen del pedido</Typography>
          
          {cartProducts.map((product) => (
            <div key={product.productId} className="cart-summary-row">
              <Typography>{product.name}</Typography>
              <Typography>{product.price}€</Typography>
            </div>
          ))}
          
          <div className="cart-total">
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" color="primary">{totalPrice.toFixed(2)}€</Typography>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<DeleteIcon />}
              onClick={handleClearCart}
              style={{ flex: 1 }}
            >
              Vaciar carrito
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<ShoppingCartCheckoutIcon />}
              onClick={handleOpenCheckout}
              className="cart-checkout-button"
              style={{ flex: 1 }}
            >
              Realizar pedido
            </Button>
          </div>
        </div>
      </div>
      
      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onClose={handleCloseCheckout} maxWidth="sm" fullWidth>
        <DialogTitle>Finalizar compra</DialogTitle>
        <DialogContent>
          {checkoutError && (
            <Alert severity="error" style={{ marginBottom: '16px' }}>
              {checkoutError}
            </Alert>
          )}
          
          {userAddresses.length > 0 && !showNewAddressForm ? (
            <>
              <Typography variant="subtitle1" gutterBottom style={{ marginTop: '8px' }}>
                Seleccione una dirección de envío:
              </Typography>
              
              {userAddresses.map((addr) => (
                <div 
                  key={addr.addressId} 
                  className={`cart-address-card ${selectedAddressId === addr.addressId ? 'selected' : ''}`}
                  onClick={() => setSelectedAddressId(addr.addressId)}
                >
                  <Typography variant="body1" className="cart-address-title">
                    {addr.street}, {addr.number}
                  </Typography>
                  <Typography variant="body2" className="cart-address-detail">
                    {addr.city}, {addr.country}, {addr.postalCode}
                  </Typography>
                </div>
              ))}
              
              <Button 
                variant="text" 
                onClick={() => setShowNewAddressForm(true)}
                style={{ marginBottom: '16px' }}
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
                  style={{ marginBottom: '16px' }}
                >
                  Usar una dirección guardada
                </Button>
              )}
              
              <Typography variant="subtitle1" gutterBottom>
                Ingrese una nueva dirección de envío:
              </Typography>
              <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }}>
                <div style={{ gridColumn: 'span 12' }}>
                  <TextField
                    fullWidth
                    label="Calle y número"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div style={{ gridColumn: 'span 6' }}>
                  <TextField
                    fullWidth
                    label="Ciudad"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div style={{ gridColumn: 'span 6' }}>
                  <TextField
                    fullWidth
                    label="Provincia"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div style={{ gridColumn: 'span 6' }}>
                  <TextField
                    fullWidth
                    label="Código postal"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
                <div style={{ gridColumn: 'span 6' }}>
                  <TextField
                    fullWidth
                    label="País"
                    name="country"
                    value={address.country}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>
            </>
          )}
          
          <div style={{ marginTop: '24px' }}>
            <Typography variant="h6">Resumen del pedido</Typography>
            <Divider style={{ margin: '8px 0' }} />
            {cartProducts.map((product) => (
              <div key={product.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Typography>{product.name}</Typography>
                <Typography>{product.price}€</Typography>
              </div>
            ))}
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1">Total:</Typography>
              <Typography variant="subtitle1" color="primary">{totalPrice.toFixed(2)}€</Typography>
            </div>
          </div>
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
    </div>
  );
}
