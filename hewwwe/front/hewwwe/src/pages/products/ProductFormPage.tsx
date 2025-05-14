import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  FormHelperText,
  Typography
} from '@mui/material';
import { createProduct } from '../../api/products';
import { getAllCategories } from '../../api/categories';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Category } from '../../types';
import '../../styles/pages/ProductFormPage.css';

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [imagePreview, setImagePreview] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    size: '',
    image: '',
    categoryId: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // Update image preview when image URL changes
    if (formData.image) {
      setImagePreview(formData.image);
    } else {
      setImagePreview('');
    }
  }, [formData.image]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Error al cargar las categorías');
      console.error('Error loading categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
      valid = false;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
      valid = false;
    }
    
    if (!formData.price) {
      newErrors.price = 'El precio es obligatorio';
      valid = false;
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser un número positivo';
      valid = false;
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'La categoría es obligatoria';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Verificar que el usuario esté autenticado
      if (!user || !user.userId) {
        toast.error('Debes iniciar sesión para crear un producto');
        return;
      }
      
      // Create a product object that matches the backend's ProductCreateDTO structure exactly
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        size: formData.size,
        image: formData.image || 'https://via.placeholder.com/150',
        status: 'AVAILABLE',
        publicationDate: new Date(),
        userId: user.userId,
        categoryId: Number(formData.categoryId)
      };
      
      console.log('Enviando datos del producto:', productData);
      
      // Use type assertion to bypass TypeScript's type checking
      const response = await createProduct(productData as any);
      console.log('Respuesta del servidor:', response);
      
      toast.success('Producto creado exitosamente');
      navigate('/my-products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      
      // Mostrar mensaje de error más específico si está disponible
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error('Error al crear el producto. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <div className="product-form-content">
        <div className="product-form-header">
          <Typography variant="h4" className="product-form-title">
            Nuevo Producto
          </Typography>
        </div>
        
        <div className="product-form-paper">
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nombre del producto"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Descripción"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="price"
              label="Precio (€)"
              name="price"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="size"
              label="Talla/Tamaño"
              name="size"
              value={formData.size}
              onChange={handleChange}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="image"
              label="URL de la imagen"
              name="image"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleChange}
            />
            
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Vista previa del producto" />
              </div>
            )}
            
            <FormControl 
              fullWidth 
              margin="normal" 
              required
              error={!!errors.categoryId}
            >
              <InputLabel id="category-label">Categoría</InputLabel>
              <Select
                labelId="category-label"
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                label="Categoría"
                onChange={handleSelectChange}
                disabled={loadingCategories}
              >
                {loadingCategories ? (
                  <MenuItem value="">
                    <CircularProgress size={20} /> Cargando...
                  </MenuItem>
                ) : (
                  categories.map((category) => (
                    <MenuItem key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.categoryId && <FormHelperText>{errors.categoryId}</FormHelperText>}
            </FormControl>
            
            <div className="form-actions">
              <Button
                variant="outlined"
                onClick={() => navigate('/my-products')}
                disabled={loading}
                className="form-cancel-button"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                className="form-submit-button"
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Creando...' : 'Crear Producto'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
