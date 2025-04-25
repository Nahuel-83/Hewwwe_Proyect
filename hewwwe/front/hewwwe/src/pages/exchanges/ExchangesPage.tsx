import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { getAllExchanges, deleteExchange } from '../../api/exchanges';
import type { ExchangeResponseDTO } from '../../types/dtos';
import { toast } from 'react-toastify';

export default function ExchangesPage() {
  const [exchanges, setExchanges] = useState<ExchangeResponseDTO[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadExchanges();
  }, []);

  const loadExchanges = async () => {
    try {
      const response = await getAllExchanges();
      setExchanges(response.data);
    } catch (error: any) {
      console.error('Error loading exchanges:', error);
      toast.error(error.response?.data?.message || 'Error al cargar intercambios');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este intercambio?')) return;
    
    try {
      await deleteExchange(id);
      toast.success('Intercambio eliminado correctamente');
      loadExchanges();
    } catch (error: any) {
      console.error('Error deleting exchange:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar el intercambio');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'warning';
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Intercambios</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/exchanges/new')}
        >
          Nuevo Intercambio
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {exchanges.map(exchange => (
          <Card key={exchange.exchangeId}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Intercambio #{exchange.exchangeId}
                </Typography>
                <Chip 
                  label={exchange.status}
                  color={getStatusColor(exchange.status) as any}
                  size="small"
                />
              </Box>
              
              <Typography color="textSecondary">
                Fecha: {new Date(exchange.requestDate).toLocaleDateString()}
              </Typography>
              <Typography>
                Propietario: {exchange.owner?.name || 'No disponible'}
              </Typography>
              <Typography>
                Solicitante: {exchange.requester?.name || 'No disponible'}
              </Typography>
              
              {exchange.products && exchange.products.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Productos:</Typography>
                  <List dense>
                    {exchange.products.map(product => (
                      <ListItem key={product.productId}>
                        <ListItemText 
                          primary={product.name}
                          secondary={`${product.price}€`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <IconButton 
                  size="small"
                  onClick={() => navigate(`/exchanges/${exchange.exchangeId}/edit`)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small"
                  color="error"
                  onClick={() => handleDelete(exchange.exchangeId)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
