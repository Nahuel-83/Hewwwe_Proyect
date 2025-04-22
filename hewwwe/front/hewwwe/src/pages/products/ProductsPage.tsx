import { useEffect, useState } from 'react';
import { getAllProducts } from '../../api/products';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts().then(res => setProducts(res.data));
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((p: any) => (
          <li key={p.id}>{p.name}</li>
        ))}

      </ul>
    </div>
  );
};

export default ProductsPage;