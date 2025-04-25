import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardMedia, 
  Divider,
  Chip,
  Link
} from '@mui/material';
import { getProductById } from '../../api/products';
import { Product } from '../../types';
import '../../styles/components/ProductDetail.css';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      getProductById(Number(id)).then(res => setProduct(res.data));
    }
  }, [id]);

  if (!product) return <div>Cargando...</div>;

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      p: { xs: 2, sm: 4 },
      maxWidth: 1200,
      mx: 'auto',
      width: '100%'
    }}>
      <Card className="product-detail-card">
        <Box className="product-detail-content">
          <Box className="product-detail-image-container">
            <CardMedia
              component="img"
              className="product-detail-image"
              image={product.image || 'placeholder.jpg'}
              alt={product.name}
            />
          </Box>

          <Box className="product-detail-info">
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
              {product.name}
            </Typography>

            <Typography variant="h5" color="secondary.main" sx={{ fontWeight: 'bold' }}>
              {product.price.toLocaleString('es-ES', { 
                style: 'currency', 
                currency: 'EUR'
              })}
            </Typography>

            <Divider />

            <Typography variant="body1" color="text.secondary" sx={{ 
              lineHeight: 1.8,
              whiteSpace: 'pre-line'
            }}>
              {product.description}
            </Typography>

            <Box sx={{ 
              display: 'grid', 
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }
            }}>
              {/* Detalles existentes (vendedor, estado, tamaño) */}
              <Box className="detail-item">
                <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: '80px' }}>
                  Vendedor:
                </Typography>
                {product.user && (
                  <Link 
                    component={RouterLink} 
                    to={`/users/${product.user.userId}`}
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {product.user.name}
                  </Link>
                )}
              </Box>

              <Box className="detail-item">
                <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: '80px' }}>
                  Estado:
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

              <Box className="detail-item">
                <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: '80px' }}>
                  Tamaño:
                </Typography>
                <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {product.size}
                </Typography>
              </Box>

              <Box className="detail-item" sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: '80px' }}>
                  Publicado:
                </Typography>
                <Typography>
                  {new Date(product.publicationDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>

              {/* Categoría */}
              <Box className="detail-item">
                <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: '80px' }}>
                  Categoría:
                </Typography>
                {product.category && (
                  <Chip 
                    label={product.category.name}
                    color="primary"
                    variant="outlined"
                    component={RouterLink}
                    to={`/categories/${product.category.categoryId}`}
                    clickable
                    sx={{ 
                      textTransform: 'capitalize',
                      '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText'
                      }
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default ProductDetailPage;
