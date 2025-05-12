import { useState, useEffect } from 'react';
import { Typography, Button, Card, CardMedia, CardContent, CardActions, Chip } from '@mui/material';
import { Add as AddIcon, ShoppingCart as CartIcon, RemoveShoppingCart as RemoveCartIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../api/products';
import { addToCart, removeFromCart, getUserCart } from '../../api/cart';
import { useAuth } from '../../contexts/AuthContext';
import type { Product, CartResponseDTO } from '../../types';
import { toast } from 'react-toastify';
import '../../styles/pages/ProductsPage.css';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [userCart, setUserCart] = useState<CartResponseDTO | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadProducts();
    
    // Load user's cart if authenticated
    if (isAuthenticated && user) {
      loadUserCart();
    }
  }, [isAuthenticated, user]);

  const loadProducts = async () => {
    try {
      setIsProductsLoading(true);
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error('Error al cargar los productos');
    } finally {
      setIsProductsLoading(false);
    }
  };
  
  const loadUserCart = async () => {
    if (!user) return;
    
    try {
      setCartLoading(true);
      const response = await getUserCart(user.userId);
      setUserCart(response.data);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Error al cargar el carrito');
    } finally {
      setCartLoading(false);
    }
  };
  
  const isProductInCart = (productId: number | undefined): boolean => {
    if (!userCart || !productId) return false;
    return userCart.productIds && Array.isArray(userCart.productIds) 
      ? userCart.productIds.includes(productId)
      : false;
  };
  
  const handleToggleCart = async (event: React.MouseEvent, product: Product) => {
    event.stopPropagation(); // Prevent card click navigation
    
    if (!isAuthenticated || !user) {
      toast.error('Debes iniciar sesión para añadir productos al carrito');
      return;
    }
    
    if (!product.productId) {
      console.error('Error: productId is undefined', product);
      toast.error('Error al identificar el producto');
      return;
    }
    
    try {
      setCartLoading(true);
      
      if (isProductInCart(product.productId)) {
        // Remove from cart
        await removeFromCart(user.userId, product.productId);
        toast.success('Producto eliminado del carrito');
      } else {
        // Add to cart
        await addToCart(user.userId, product.productId);
        toast.success('Producto añadido al carrito');
      }
      
      // Reload cart to update UI
      await loadUserCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Error al actualizar el carrito');
    } finally {
      setCartLoading(false);
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

        {isProductsLoading ? (
          <Typography>Loading products...</Typography>
        ) : (
          <div className="products-grid">
            {products
              .filter(product => {
                // If authenticated, filter out user's own products
                if (isAuthenticated && user) {
                  return product.userId !== user.userId;
                }
                // If not authenticated, show all
                return true;
              })
              .map((product) => (
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
                <CardActions sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
                  <Chip
                    label={product.status}
                    color={
                      product.status === 'AVAILABLE' ? 'success' :
                      product.status === 'RESERVED' ? 'warning' : 'error'
                    }
                    size="small"
                  />
                  
                  {isAuthenticated && product.status === 'AVAILABLE' && (
                    <Button
                      size="small"
                      variant="outlined"
                      color={isProductInCart(product.productId) ? 'error' : 'primary'}
                      startIcon={isProductInCart(product.productId) ? <RemoveCartIcon /> : <CartIcon />}
                      onClick={(e) => handleToggleCart(e, product)}
                      disabled={cartLoading}
                    >
                      {isProductInCart(product.productId) ? 'Quitar' : 'Añadir'}
                    </Button>
                  )}
                </CardActions>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}