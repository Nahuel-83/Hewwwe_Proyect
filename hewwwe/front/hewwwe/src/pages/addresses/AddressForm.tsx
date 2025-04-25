import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { createAddress, getAddressById, updateAddress } from '../../api/addresses';
import type { AddressCreateDTO } from '../../types/dtos';
import { toast } from 'react-toastify';

export default function AddressForm() {
  const [address, setAddress] = useState<Partial<AddressCreateDTO>>({
    street: '',
    number: '',
    city: '',
    country: '',
    postalCode: '',
  });
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (id) {
      loadAddress(parseInt(id));
    }
  }, [id]);

  const loadAddress = async (addressId: number) => {
    try {
      const response = await getAddressById(addressId);
      setAddress(response.data);
    } catch (error) {
      toast.error('Error al cargar dirección');
      navigate('/addresses');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && id) {
        await updateAddress(parseInt(id), address as AddressCreateDTO);
        toast.success('Dirección actualizada');
      } else {
        // Aquí deberías obtener el userId de algún contexto de autenticación
        const userId = 1; // Ejemplo
        await createAddress(userId, address as AddressCreateDTO);
        toast.success('Dirección creada');
      }
      navigate('/addresses');
    } catch (error) {
      toast.error('Error al guardar dirección');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {isEditing ? 'Editar Dirección' : 'Nueva Dirección'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              name="street"
              label="Calle"
              value={address.street}
              onChange={handleChange}
              required
            />
            <TextField
              name="number"
              label="Número"
              value={address.number}
              onChange={handleChange}
              required
            />
            <TextField
              name="city"
              label="Ciudad"
              value={address.city}
              onChange={handleChange}
              required
            />
            <TextField
              name="country"
              label="País"
              value={address.country}
              onChange={handleChange}
              required
            />
            <TextField
              name="postalCode"
              label="Código Postal"
              value={address.postalCode}
              onChange={handleChange}
              required
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button 
                type="button" 
                onClick={() => navigate('/addresses')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="contained"
              >
                {isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
