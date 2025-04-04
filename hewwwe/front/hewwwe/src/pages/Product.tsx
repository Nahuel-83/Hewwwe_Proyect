import React from 'react';
import { useParams } from 'react-router-dom';
import products from '../data/mockProducts';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === parseInt(id || '', 10));

  if (!product) {
    return <div className="p-6">Producto no encontrado.</div>;
  }

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6">
      <img src={product.image} alt={product.title} className="w-full md:w-1/2 object-cover rounded" />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="text-green-600 text-xl font-semibold">{product.price}€</p>
        <p className="text-gray-700">{product.description}</p>
        <button className="bg-green-500 text-white px-4 py-2 mt-4 rounded">Comprar ahora</button>
      </div>
    </div>
  );
};

export default Product;
