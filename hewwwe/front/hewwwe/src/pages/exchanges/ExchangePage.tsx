import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import { getUserExchanges, updateExchangeStatus, acceptExchange } from '../../api/exchanges';
import { getAllProducts } from '../../api/products';
import { Exchange, Product, ExchangeStatus } from '../../types';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

export default function ExchangePage() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const userId = user?.userId || 0;

  useEffect(() => {
    if (userId > 0) {
      loadExchanges();
    }
  }, [userId]);

  const loadExchanges = async () => {
    try {
      const response = await getUserExchanges(userId);
      setExchanges(response.data);
      console.log('Exchanges loaded:', response.data);
    } catch (error) {
      console.error('Error loading exchanges:', error);
      toast.error('Error al cargar intercambios');
    }
  };

  const handleUpdateStatus = async (exchangeId: number, newStatus: ExchangeStatus, products: Product[]) => {
    try {
      setLoading(true);
      
      console.log(`Updating exchange ${exchangeId} status to ${newStatus}`);
      
      if (newStatus === 'ACCEPTED') {
        // Usar el endpoint específico para aceptar que ya maneja la actualización de productos en el backend
        await acceptExchange(exchangeId);
        toast.success('Intercambio aceptado. Los productos han sido marcados como vendidos.');
        
        // Forzar recarga de la página para actualizar todos los datos
        window.location.reload();
      } else {
        // Para rechazo, seguir usando el endpoint normal
        await updateExchangeStatus(exchangeId, newStatus);
        toast.success('Intercambio rechazado');
        await loadExchanges();
      }
      
    } catch (error) {
      console.error('Error updating exchange status:', error);
      toast.error('Error al actualizar el estado del intercambio');
    } finally {
      setLoading(false);
    }
  };

  const getOtherPartyName = (exchange: Exchange) => {
    if (exchange.ownerId === userId) {
      return exchange.requesterName || "Usuario desconocido";
    } else {
      return exchange.ownerName || "Usuario desconocido";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Mis Intercambios</Typography>
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3 
      }}>
        {exchanges.map((exchange) => (
          <Box 
            key={exchange.exchangeId} 
            sx={{ 
              flexGrow: 1,
              flexBasis: { xs: '100%', md: 'calc(50% - 24px)' },
              minWidth: '280px'
            }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    Intercambio #{exchange.exchangeId}
                  </Typography>
                  <Chip 
                    label={exchange.status}
                    color={
                      exchange.status === 'PENDING' ? 'warning' :
                      exchange.status === 'ACCEPTED' ? 'success' : 'error'
                    }
                  />
                </Box>
                <Typography gutterBottom>
                  Con: {getOtherPartyName(exchange)}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>Productos:</Typography>
                {exchange.products.map(product => (
                  <Typography key={product.productId} color="text.secondary">
                    - {product.name} ({product.status})
                  </Typography>
                ))}
                {exchange.status === 'PENDING' && exchange.ownerId === userId && (
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="success"
                      onClick={() => handleUpdateStatus(exchange.exchangeId, 'ACCEPTED', exchange.products)}
                      sx={{ mr: 1 }}
                      disabled={loading}
                      startIcon={loading && <CircularProgress size={20} color="inherit" />}
                    >
                      {loading ? 'Procesando...' : 'Aceptar'}
                    </Button>
                    <Button 
                      variant="contained" 
                      color="error"
                      onClick={() => handleUpdateStatus(exchange.exchangeId, 'REJECTED', exchange.products)}
                      disabled={loading}
                    >
                      Rechazar
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
