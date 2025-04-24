import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent,
  Chip,
  Divider 
} from '@mui/material';
import { getProductById } from '../../api/products';
import { Product } from '../../types';

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
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      alignItems: 'flex-start',
      bgcolor: 'background.default',
      py: { xs: 1, sm: 2 },
      px: 0
    }}>
      <Box sx={{ 
        width: '100%',
        maxWidth: 'none'
      }}>
        <Card sx={{ 
          width: '100%', 
          boxShadow: 'none',
          bgcolor: 'background.paper',
          borderRadius: 0,
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            minHeight: { md: '700px' }
          }}>
            {product.image && (
              <Box sx={{ 
                flex: '0 0 auto',
                width: { xs: '100%', md: '55%' },
                position: 'relative',
                bgcolor: 'grey.50'
              }}>
                <CardMedia
                  component="img"
                  sx={{ 
                    width: '100%',
                    height: { xs: '400px', md: '100%' },
                    objectFit: 'contain',
                    p: 2
                  }}
                  image={product.image}
                  alt={product.name}
                />
              </Box>
            )}
            <CardContent sx={{ 
              flex: 1, 
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <Typography variant="h4" gutterBottom>{product.name}</Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                {product.price}€
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Vendedor:
                  </Typography>
                  <Typography>
                    {product.user?.name || 'No disponible'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Categoría:
                  </Typography>
                  <Typography>
                    {product.category?.name || 'No disponible'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
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

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Tamaño:
                  </Typography>
                  <Typography>{product.size}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fecha de publicación:
                  </Typography>
                  <Typography>
                    {new Date(product.publicationDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default ProductDetailPage;
