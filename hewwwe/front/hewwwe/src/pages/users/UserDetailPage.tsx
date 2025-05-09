import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  List,
  ListItem,
  Card,
  CardContent,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { getUserById, deleteUser } from '../../api/users';
import { toast } from 'react-toastify';
import type { User } from '../../types';

export default function UserDetailPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();

  useEffect(() => {
    loadUserData();
  }, [id]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await getUserById(Number(id));
      setUser(response.data);
    } catch (error) {
      toast.error('Error al cargar los datos del usuario');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !window.confirm('¿Estás seguro de eliminar tu cuenta?')) return;

    try {
      await deleteUser(user.userId);
      toast.success('Cuenta eliminada correctamente');
      if (authUser?.userId === user.userId) {
        logout();
      }
      navigate('/');
    } catch (error) {
      toast.error('Error al eliminar la cuenta');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return null;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Perfil de Usuario</Typography>
        {authUser?.userId === user.userId && (
          <Box>
            <Button 
              startIcon={<EditIcon />}
              onClick={() => navigate(`/users/${user.userId}/edit`)}
              sx={{ mr: 1 }}
            >
              Editar
            </Button>
            <Button 
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Eliminar Cuenta
            </Button>
          </Box>
        )}
      </Box>

      <Box display="flex" gap={3} flexDirection={{ xs: 'column', md: 'row' }}>
        {/* User Information */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Información Personal</Typography>
            <List>
              <ListItem>
                <Typography><strong>Nombre:</strong> {user.name}</Typography>
              </ListItem>
              <ListItem>
                <Typography><strong>Email:</strong> {user.email}</Typography>
              </ListItem>
              <ListItem>
                <Typography><strong>Teléfono:</strong> {user.phone}</Typography>
              </ListItem>
            </List>
          </CardContent>
        </Card>

      </Box>
    </Box>
  );
}
