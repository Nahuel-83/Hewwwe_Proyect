import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, ShoppingCart as CartIcon } from '@mui/icons-material';
import { getAllUsers, deleteUser } from '../../api/users';
import type { User } from '../../types';
import { toast } from 'react-toastify';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.userId !== id));
      toast.success('Usuario eliminado');
    } catch (error) {
      toast.error('Error al eliminar usuario');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Usuarios</Typography>
        <Button variant="contained" onClick={() => navigate('/users/new')}>
          Nuevo Usuario
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
        }
      }}>
        {users.map((user) => (
          <Card key={user.userId}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{user.username}</Typography>
              <Typography color="textSecondary">{user.email}</Typography>
              <Chip 
                label={user.role} 
                color={user.role === 'ADMIN' ? 'secondary' : 'primary'}
                size="small"
                sx={{ mt: 1 }}
              />
              <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <IconButton size="small" onClick={() => navigate(`/users/${user.userId}/cart`)}>
                  <CartIcon />
                </IconButton>
                <IconButton size="small" onClick={() => navigate(`/users/${user.userId}/edit`)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(user.userId)}>
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
