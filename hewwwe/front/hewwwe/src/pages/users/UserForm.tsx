import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { createUser, getUserById, updateUser } from '../../api/users';
import { toast } from 'react-toastify';
import '../../styles/common/loading.css';
import '../../styles/forms/form.css';

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  password?: string;
}

export default function UserForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'USER',
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      loadUser(Number(id));
    }
  }, [id]);

  const loadUser = async (userId: number) => {
    try {
      setLoading(true);
      const response = await getUserById(userId);
      const { registrationDate, role, addresses, products, userId: _, ...rest } = response.data;
      
      // Validate role before setting state
      const validRole = role === 'ADMIN' ? 'ADMIN' : 'USER';
      
      setFormData({
        ...rest,
        role: validRole,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cargar el usuario');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        const { password, ...updateData } = formData; // Remove password from update data
        await updateUser(Number(id), updateData);
        toast.success('Usuario actualizado correctamente');
      } else {
        if (!formData.password) {
          toast.error('La contraseña es requerida para nuevos usuarios');
          return;
        }
        await createUser(formData);
        toast.success('Usuario creado correctamente');
      }
      navigate('/users');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="form-container">
      <Typography className="form-title" variant="h4">
        {isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
      </Typography>

      <Paper className="form-paper">
        <Box component="form" onSubmit={handleSubmit} className="form-content">
          <TextField
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />
          
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
          />
          
          <TextField
            label="Teléfono"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            fullWidth
          />
          
          <TextField
            select
            label="Rol"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            fullWidth
          >
            <MenuItem value="USER">Usuario</MenuItem>
            <MenuItem value="ADMIN">Administrador</MenuItem>
          </TextField>
          
          {!isEdit && (
            <TextField
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password || ''}
              onChange={handleChange}
              required={!isEdit}
              fullWidth
            />
          )}

          <Box className="form-actions">
            <Button type="button" onClick={() => navigate('/users')}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {isEdit ? 'Actualizar' : 'Crear'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
