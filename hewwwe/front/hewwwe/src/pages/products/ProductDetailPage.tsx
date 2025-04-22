import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../../api/products';
import { Product } from '../../types/index'; // Asegúrate de ajustar el path

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      getProductById(Number(id)).then(res => setProduct(res.data));
    }
  }, [id]);

  if (!product) return <div>Cargando...</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      {product.image && (
        <img src={product.image} alt={product.name} width={200} />
      )}
      <p><strong>Descripción:</strong> {product.description}</p>
      <p><strong>Precio:</strong> ${product.price}</p>
      <p><strong>Tamaño:</strong> {product.size}</p>
      <p><strong>Estado:</strong> {product.status}</p>
      <p><strong>Publicado el:</strong> {new Date(product.publicationDate).toLocaleDateString()}</p>
      <p><strong>ID del Usuario:</strong> {product.userId}</p>
      <p><strong>ID de Categoría:</strong> {product.categoryId}</p>
      {product.cartId && <p><strong>En carrito:</strong> {product.cartId}</p>}
      {product.exchangeId && <p><strong>Parte de intercambio:</strong> {product.exchangeId}</p>}
    </div>
  );
};

export default ProductDetailPage;
