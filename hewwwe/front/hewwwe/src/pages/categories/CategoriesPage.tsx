import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';
import { getAllCategories } from '../../api/categories';
import { Category } from '../../types';
import { toast } from 'react-toastify';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Categorías</Typography>
      <List>
        {categories.map((category) => (
          <Card key={category.categoryId} sx={{ mb: 2 }}>
            <CardContent>
              <ListItem
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => navigate(`/categories/${category.categoryId}`)}
              >
                <ListItemText
                  primary={category.name}
                  secondary={category.description}
                />
              </ListItem>
            </CardContent>
          </Card>
        ))}
      </List>
    </Box>
  );
};

export default CategoriesPage;
