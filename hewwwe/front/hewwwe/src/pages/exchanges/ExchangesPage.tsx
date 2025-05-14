import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Card, 
  CircularProgress, 
  Button, 
  Divider,
  Chip,
  Alert
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { getUserExchanges, acceptExchange, rejectExchange } from '../../api/exchanges';
import { Exchange } from '../../types';
import { toast } from 'react-toastify';
import '../../styles/pages/ExchangesPage.css';

const ExchangesPage = () => {
  const [loading, setLoading] = useState(true);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    loadExchanges();
  }, [user]);

  const loadExchanges = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await getUserExchanges(user.userId);
      console.log('Exchanges response:', response.data);
      
      // Check if data is valid
      if (Array.isArray(response.data)) {
        setExchanges(response.data);
      } else {
        console.error('Invalid exchange data format:', response.data);
        toast.error('Error: Formato de datos inválido');
        setExchanges([]);
      }
    } catch (error) {
      console.error('Error loading exchanges:', error);
      toast.error('Error al cargar los intercambios');
      setExchanges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAcceptExchange = async (exchangeId: number) => {
    try {
      await acceptExchange(exchangeId);
      toast.success('Intercambio aceptado correctamente');
      loadExchanges();
    } catch (error) {
      toast.error('Error al aceptar el intercambio');
    }
  };

  const handleRejectExchange = async (exchangeId: number) => {
    try {
      await rejectExchange(exchangeId);
      toast.success('Intercambio rechazado');
      loadExchanges();
    } catch (error) {
      toast.error('Error al rechazar el intercambio');
    }
  };

  // Filtrar intercambios según la pestaña seleccionada
  const filteredExchanges = exchanges.filter(exchange => {
    if (tabValue === 0) return true; // Todos
    if (tabValue === 1) return exchange.status === 'PENDING'; // Pendientes
    if (tabValue === 2) return exchange.status === 'ACCEPTED' || exchange.status === 'COMPLETED'; // Aceptados
    if (tabValue === 3) return exchange.status === 'REJECTED'; // Rechazados
    return false;
  });

  // Determinar si el usuario actual es propietario u oferente
  const getExchangeRole = (exchange: Exchange) => {
    if (!user) return 'unknown';
    return exchange.owner === user.userId ? 'owner' : 'requester';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="exchanges-page-container">
      <Typography variant="h4" gutterBottom>
        Mis Intercambios
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="Todos" />
        <Tab label="Pendientes" />
        <Tab label="Aceptados" />
        <Tab label="Rechazados" />
      </Tabs>

      {filteredExchanges.length === 0 ? (
        <Alert severity="info">
          No tienes intercambios {tabValue === 1 ? 'pendientes' : 
                               tabValue === 2 ? 'aceptados' : 
                               tabValue === 3 ? 'rechazados' : ''}
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {filteredExchanges.map((exchange) => {
            const userRole = getExchangeRole(exchange);
            const isPending = exchange.status === 'PENDING';
            const isOwner = userRole === 'owner';
            
            return (
              <Card className="exchange-card" key={exchange.exchangeId}>
                <Box className="exchange-header">
                  <Typography variant="h6">
                    Intercambio #{exchange.exchangeId}
                  </Typography>
                  <Chip 
                    label={exchange.status} 
                    color={
                      exchange.status === 'PENDING' ? 'warning' :
                      exchange.status === 'ACCEPTED' ? 'success' :
                      exchange.status === 'COMPLETED' ? 'success' :
                      'error'
                    }
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Propuesto el {exchange.exchangeDate ? new Date(exchange.exchangeDate).toLocaleDateString() : 'Fecha desconocida'}
                  {exchange.completionDate && (
                    <> • Completado el {new Date(exchange.completionDate).toLocaleDateString()}</>
                  )}
                </Typography>
                
                <Divider sx={{ mb: 2 }} />
                
                {!exchange.products || exchange.products.length === 0 ? (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    No hay información de productos disponible para este intercambio
                  </Alert>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {isOwner ? 'Te ofrecen:' : 'Tú ofreces:'}
                      </Typography>
                      
                      {exchange.products && exchange.products
                        .filter(p => p && p.userId === (isOwner ? exchange.requester : exchange.owner))
                        .map(product => (
                        <Box 
                          key={product.productId} 
                          sx={{ 
                            display: 'flex', 
                            mb: 1,
                            border: '1px solid #eee',
                            borderRadius: 1,
                            p: 1
                          }}
                        >
                          <img 
                            src={product.image || 'placeholder.jpg'} 
                            alt={product.name}
                            style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 10, borderRadius: 4 }}
                          />
                          <Box>
                            <Typography variant="subtitle2">
                              {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {product.price?.toLocaleString('es-ES', { 
                                style: 'currency', 
                                currency: 'EUR'
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {isOwner ? 'A cambio de tu:' : 'A cambio de:'}
                      </Typography>
                      
                      {exchange.products && exchange.products
                        .filter(p => p && p.userId === (isOwner ? exchange.owner : exchange.requester))
                        .map(product => (
                        <Box 
                          key={product.productId} 
                          sx={{ 
                            display: 'flex', 
                            mb: 1,
                            border: '1px solid #eee',
                            borderRadius: 1,
                            p: 1
                          }}
                        >
                          <img 
                            src={product.image || 'placeholder.jpg'} 
                            alt={product.name}
                            style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 10, borderRadius: 4 }}
                          />
                          <Box>
                            <Typography variant="subtitle2">
                              {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {product.price?.toLocaleString('es-ES', { 
                                style: 'currency', 
                                currency: 'EUR'
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
                
                {isPending && isOwner && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outlined" 
                      color="error"
                      onClick={() => handleRejectExchange(exchange.exchangeId)}
                    >
                      Rechazar
                    </Button>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => handleAcceptExchange(exchange.exchangeId)}
                    >
                      Aceptar Intercambio
                    </Button>
                  </Box>
                )}
                
                {isPending && !isOwner && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Esperando respuesta del propietario
                    </Typography>
                  </Box>
                )}
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default ExchangesPage;
