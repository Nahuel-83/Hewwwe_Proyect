import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { createCategory, getCategoryById, updateCategory } from '../../../api/categories';
import type { Category } from '../../../types';
import { toast } from 'react-toastify';

export default function AdminCategoryForm() {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Partial<Category>>({
    name: '',
    description: '',
  });
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      loadCategory(Number(id));
    }
  }, [id]);

  const loadCategory = async (categoryId: number) => {
    try {
      setLoading(true);
      const response = await getCategoryById(categoryId);
      const { products, categoryId: _, ...rest } = response.data;
      setCategory(rest);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al cargar la categoría');
      navigate('/admin/categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category.name || !category.description) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await updateCategory(Number(id), category);
        toast.success('Categoría actualizada correctamente');
      } else {
        await createCategory(category);
        toast.success('Categoría creada correctamente');
      }
      navigate('/admin/categories');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading && isEdit) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="form-container">
      <Typography className="form-title" variant="h4">
        {isEdit ? 'Editar Categoría' : 'Nueva Categoría'}
      </Typography>

      <Paper className="form-paper">
        <Box component="form" onSubmit={handleSubmit} className="form-content">
          <TextField
            label="Nombre"
            name="name"
            value={category.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Descripción"
            name="description"
            multiline
            rows={4}
            value={category.description}
            onChange={handleChange}
            required
            fullWidth
          />

          <Box className="form-actions">
            <Button type="button" onClick={() => navigate('/categories')}>
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
