import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { getAllCategories, deleteCategory } from '../../api/categories';
import type { Category } from '../../types';
import { toast } from 'react-toastify';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Error al cargar categorías');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.categoryId !== id));
      toast.success('Categoría eliminada');
    } catch (error) {
      toast.error('Error al eliminar categoría');
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Categorías</Typography>
        <Button variant="contained" onClick={() => navigate('/categories/new')}>
          Nueva Categoría
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
        {categories.map((category) => (
          <Card key={category.categoryId}>
            <CardContent>
              <Typography variant="h6" gutterBottom>{category.name}</Typography>
              <Typography color="textSecondary">{category.description}</Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <IconButton size="small" onClick={() => navigate(`/categories/${category.categoryId}/edit`)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(category.categoryId)}>
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
