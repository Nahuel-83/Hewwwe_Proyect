import { Product } from '../types/Product';

const products: Product[] = [
  {
    id: 1,
    title: 'Sudadera Nike',
    price: 25,
    image: 'https://via.placeholder.com/300x400?text=Sudadera+Nike',
    description: 'Sudadera cómoda de algodón, usada pero en buen estado.',
  },
  {
    id: 2,
    title: 'Zapatillas Adidas',
    price: 40,
    image: 'https://via.placeholder.com/300x400?text=Zapatillas+Adidas',
    description: 'Zapatillas casi nuevas, talla 42.',
  },
  {
    id: 3,
    title: 'Chaqueta Zara',
    price: 30,
    image: 'https://via.placeholder.com/300x400?text=Chaqueta+Zara',
    description: 'Chaqueta moderna ideal para otoño.',
  },
];

export default products;
