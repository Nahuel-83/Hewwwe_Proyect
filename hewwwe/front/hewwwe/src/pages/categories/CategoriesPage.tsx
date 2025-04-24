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
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Categorías</Typography>
        <Button variant="contained" onClick={() => navigate('/categories/new')}>
          Nueva Categoría
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {categories.map((category) => (
          <Card key={category.categoryId} sx={{ width: 300 }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>{category.name}</Typography>
                  <Box sx={{ 
                    p: 1, 
                    bgcolor: 'background.default', 
                    borderRadius: 1,
                    minHeight: '60px'
                  }}>
                    <Typography color="textSecondary">{category.description}</Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pt: 1,
                  borderTop: 1,
                  borderColor: 'divider'
                }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small"
                      onClick={() => navigate(`/categories/${category.categoryId}/edit`)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small"
                      color="error" 
                      onClick={() => handleDelete(category.categoryId)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
