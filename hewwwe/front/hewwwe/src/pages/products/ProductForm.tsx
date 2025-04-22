import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper
} from '@mui/material';
import { createProduct, getProductById, updateProduct, getAllCategories } from '../../api/services';
import type { Product, Category } from '../../types';
import { toast } from 'react-toastify';

export default function ProductForm() {
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    size: '',
    status: 'AVAILABLE'
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    loadCategories();
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Error al cargar categorías');
    }
  };

  const loadProduct = async (productId: number) => {
    try {
      const response = await getProductById(productId);
      setProduct(response.data);
    } catch (error) {
      toast.error('Error al cargar el producto');
      navigate('/products');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await updateProduct(parseInt(id), product);
        toast.success('Producto actualizado');
      } else {
        await createProduct(product);
        toast.success('Producto creado');
      }
      navigate('/products');
    } catch (error) {
      toast.error('Error al guardar el producto');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        {id ? 'Editar Producto' : 'Nuevo Producto'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Nombre"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
          
          <TextField
            label="Descripción"
            name="description"
            multiline
            rows={4}
            value={product.description}
            onChange={handleChange}
            required
          />
          
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <TextField
              sx={{ flex: 1 }}
              label="Precio"
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
              required
            />
            
            <TextField
              sx={{ flex: 1 }}
              label="Categoría"
              name="categoryId"
              select
              value={product.categoryId || ''}
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <TextField
            label="Imagen URL"
            name="image"
            value={product.image}
            onChange={handleChange}
          />

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <TextField
              sx={{ flex: 1 }}
              label="Talla"
              name="size"
              value={product.size}
              onChange={handleChange}
              required
            />
            
            <TextField
              sx={{ flex: 1 }}
              label="Estado"
              name="status"
              select
              value={product.status}
              onChange={handleChange}
              required
            >
              <MenuItem value="AVAILABLE">Disponible</MenuItem>
              <MenuItem value="SOLD">Vendido</MenuItem>
              <MenuItem value="RESERVED">Reservado</MenuItem>
            </TextField>
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button variant="contained" type="submit">
            {id ? 'Actualizar' : 'Crear'}
          </Button>
          <Button variant="outlined" onClick={() => navigate('/products')}>
            Cancelar
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
