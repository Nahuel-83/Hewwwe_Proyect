import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../styles/forms.css';
import { createProduct, getProductById, updateProduct } from '../../../api/products';
import { getAllCategories } from '../../../api/categories';
import type { Product, Category } from '../../../types';
import { toast } from 'react-toastify';

export default function ProductForm() {
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    size: '',
    status: 'AVAILABLE',
    categoryId: 0,
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
      navigate('/admin/products');
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
      navigate('/admin/products');
    } catch (error) {
      toast.error('Error al guardar el producto');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setProduct(prev => ({
      ...prev,
      [name]: name === 'categoryId' ? Number(value) : value
    }));
  };

  return (
    <div className="form-bg">
      <div className="form-panel">
        <h2 className="form-title">{id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nombre</label>
            <input
              id="name"
              type="text"
              name="name"
              className="form-input"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description" className="form-label">Descripción</label>
            <textarea
              id="description"
              name="description"
              className="form-input"
              rows={4}
              value={product.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="price" className="form-label">Precio</label>
              <input
                id="price"
                type="number"
                name="price"
                className="form-input"
                value={product.price}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="categoryId" className="form-label">Categoría</label>
              <select
                id="categoryId"
                name="categoryId"
                className="form-input"
                value={product.categoryId || ''}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="image" className="form-label">Imagen URL</label>
            <input
              id="image"
              type="text"
              name="image"
              className="form-input"
              value={product.image}
              onChange={handleChange}
            />
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="size" className="form-label">Talla</label>
              <input
                id="size"
                type="text"
                name="size"
                className="form-input"
                value={product.size}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="status" className="form-label">Estado</label>
              <select
                id="status"
                name="status"
                className="form-input"
                value={product.status}
                onChange={handleChange}
                required
              >
                <option value="AVAILABLE">Disponible</option>
                <option value="SOLD">Vendido</option>
                <option value="RESERVED">Reservado</option>
              </select>
            </div>
          </div>
          <div className="form-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button type="submit" className="form-button form-button-primary">{id ? 'Actualizar' : 'Crear'}</button>
            <button type="button" className="form-button form-button-secondary" onClick={() => navigate('/admin/products')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
