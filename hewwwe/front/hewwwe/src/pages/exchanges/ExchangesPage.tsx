import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { getAllExchanges, deleteExchange } from '../../api/exchanges';
import type { Exchange } from '../../types';
import { toast } from 'react-toastify';

export default function ExchangesPage() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadExchanges();
  }, []);

  const loadExchanges = async () => {
    try {
      const response = await getAllExchanges();
      setExchanges(response.data);
    } catch (error) {
      toast.error('Error al cargar intercambios');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteExchange(id);
      setExchanges(prev => prev.filter(e => e.exchangeId !== id));
      toast.success('Intercambio eliminado');
    } catch (error) {
      toast.error('Error al eliminar el intercambio');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Intercambios</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/exchanges/new')}
        >
          Nuevo Intercambio
        </Button>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3,
        '& > *': { 
          flexBasis: '300px',
          flexGrow: 1,
          maxWidth: 'calc(33.333% - 16px)',
          '@media (max-width: 900px)': {
            maxWidth: 'calc(50% - 16px)',
          },
          '@media (max-width: 600px)': {
            maxWidth: '100%',
          },
        }
      }}>
        {exchanges.map((exchange) => (
          <Card key={exchange.exchangeId}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Intercambio #{exchange.exchangeId}
              </Typography>
              <Chip 
                label={exchange.status} 
                color={exchange.status === 'COMPLETED' ? 'success' : 'primary'} 
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Fecha: {new Date(exchange.exchangeDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Productos: {exchange.products.length}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <IconButton 
                  size="small" 
                  onClick={() => navigate(`/exchanges/${exchange.exchangeId}/edit`)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => handleDelete(exchange.exchangeId)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
