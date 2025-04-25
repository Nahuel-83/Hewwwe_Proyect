import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
} from '@mui/material';
import { getUserExchanges, updateExchangeStatus } from '../../api/exchanges';
import { Exchange } from '../../types';
import { toast } from 'react-toastify';

export default function ExchangePage() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const userId = 1; // TODO: Get from auth context

  useEffect(() => {
    loadExchanges();
  }, []);

  const loadExchanges = async () => {
    try {
      const response = await getUserExchanges(userId);
      setExchanges(response.data);
    } catch (error) {
      toast.error('Error al cargar intercambios');
    }
  };

  const handleUpdateStatus = async (exchangeId: number, newStatus: string) => {
    try {
      await updateExchangeStatus(exchangeId, newStatus);
      toast.success('Estado actualizado');
      loadExchanges();
    } catch (error) {
      toast.error('Error al actualizar estado');
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
                  Con: {exchange.owner.userId === userId ? 
                    exchange.requester.name : 
                    exchange.owner.name}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>Productos:</Typography>
                {exchange.products.map(product => (
                  <Typography key={product.productId} color="text.secondary">
                    - {product.name}
                  </Typography>
                ))}
                {exchange.status === 'PENDING' && exchange.owner.userId === userId && (
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="contained" 
                      color="success"
                      onClick={() => handleUpdateStatus(exchange.exchangeId, 'ACCEPTED')}
                      sx={{ mr: 1 }}
                    >
                      Aceptar
                    </Button>
                    <Button 
                      variant="contained" 
                      color="error"
                      onClick={() => handleUpdateStatus(exchange.exchangeId, 'REJECTED')}
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
