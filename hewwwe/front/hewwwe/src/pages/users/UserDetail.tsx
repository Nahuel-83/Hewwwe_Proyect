import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUserById, getUserProducts, getUserAddresses } from '../../api/users';
import type { User, Product, Address } from '../../types';
import { toast } from 'react-toastify';

export default function UserDetail() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadUserData(Number(id));
    }
  }, [id]);

  const loadUserData = async (userId: number) => {
    try {
      setLoading(true);
      const [userResponse, productsResponse, addressesResponse] = await Promise.all([
        getUserById(userId),
        getUserProducts(userId),
        getUserAddresses(userId)
      ]);

      setUser(userResponse.data);
      setProducts(productsResponse.data);
      setAddresses(addressesResponse.data);
    } catch (error) {
      toast.error('Error al cargar los datos del usuario');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      // Add logic to delete the address
      toast.success('Dirección eliminada correctamente');
      setAddresses(addresses.filter(address => address.addressId !== addressId));
    } catch (error) {
      toast.error('Error al eliminar la dirección');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Detalle del Usuario</Typography>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate(`/users/${id}/edit`)}
            sx={{ mr: 2 }}
          >
            Editar
          </Button>
          <Button variant="outlined" onClick={() => navigate('/users')}>
            Volver
          </Button>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: { xs: 2, md: 3 },
      }}>
        {/* Información Personal */}
        <Box sx={{ 
          flexGrow: 1,
          flexBasis: { xs: '100%', sm: '45%', md: '30%' },
          minWidth: '280px'
        }}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
              Información Personal
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Nombre" 
                  secondary={user.name} 
                  primaryTypographyProps={{ color: 'text.secondary' }}
                  secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Email" 
                  secondary={user.email} 
                  primaryTypographyProps={{ color: 'text.secondary' }}
                  secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Teléfono" 
                  secondary={user.phone} 
                  primaryTypographyProps={{ color: 'text.secondary' }}
                  secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Rol" 
                  secondary={
                    <Chip 
                      label={user.role} 
                      color={user.role === 'ADMIN' ? 'secondary' : 'primary'}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  }
                  primaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Fecha de registro" 
                  secondary={new Date(user.registrationDate).toLocaleDateString()} 
                  primaryTypographyProps={{ color: 'text.secondary' }}
                  secondaryTypographyProps={{ color: 'text.primary', variant: 'body1' }}
                />
              </ListItem>
            </List>
          </Paper>
        </Box>

        {/* Direcciones */}
        <Box sx={{ 
          flexGrow: 1,
          flexBasis: { xs: '100%', sm: '45%', md: '30%' },
          minWidth: '280px'
        }}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
              Direcciones
              <Button 
                size="small" 
                sx={{ float: 'right' }}
                onClick={() => navigate(`/users/${id}/addresses/new`)}
              >
                Añadir
              </Button>
            </Typography>
            <List>
              {addresses.map((address) => (
                <ListItem 
                  key={address.addressId} 
                  sx={{ 
                    flexDirection: 'column', 
                    alignItems: 'flex-start',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    p: 2
                  }}
                >
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {address.street}, {address.number}
                    </Typography>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/users/${id}/addresses/${address.addressId}/edit`);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address.addressId);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {address.city}, {address.country}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    CP: {address.postalCode}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        {/* Productos */}
        <Box sx={{ 
          flexGrow: 1,
          flexBasis: { xs: '100%', sm: '100%', md: '30%' },
          minWidth: '280px'
        }}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
              Productos
            </Typography>
            <List>
              {products.map((product) => (
                <ListItem 
                  key={product.productId} 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => navigate(`/products/${product.productId}`)}
                >
                  <ListItemText
                    primary={product.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Precio: {product.price}€
                        </Typography>
                        <Chip 
                          label={product.status} 
                          size="small"
                          color={
                            product.status === 'AVAILABLE' ? 'success' :
                            product.status === 'SOLD' ? 'error' : 'warning'
                          }
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
