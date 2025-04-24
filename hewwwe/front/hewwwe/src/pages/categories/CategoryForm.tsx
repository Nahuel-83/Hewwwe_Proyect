import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { createCategory, getCategoryById, updateCategory } from '../../api/categories';
import type { Category } from '../../types';
import { toast } from 'react-toastify';

export default function CategoryForm() {
  const [category, setCategory] = useState<Partial<Category>>({
    name: '',
    description: '',
  });
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      loadCategory(parseInt(id));
    }
  }, [id]);

  const loadCategory = async (categoryId: number) => {
    try {
      const response = await getCategoryById(categoryId);
      setCategory(response.data);
    } catch (error) {
      toast.error('Error al cargar categoría');
      navigate('/categories');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await updateCategory(parseInt(id), category);
        toast.success('Categoría actualizada');
      } else {
        await createCategory(category);
        toast.success('Categoría creada');
      }
      navigate('/categories');
    } catch (error) {
      toast.error('Error al guardar categoría');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {id ? 'Editar Categoría' : 'Nueva Categoría'}
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Nombre"
            name="name"
            value={category.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Descripción"
            name="description"
            multiline
            rows={4}
            value={category.description}
            onChange={handleChange}
            required
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button type="button" onClick={() => navigate('/categories')}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              {id ? 'Actualizar' : 'Crear'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
