import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
  <header className="bg-white shadow-md p-4 flex justify-between items-center">
    <Link to="/" className="text-xl font-bold text-green-600">VintedClone</Link>
    <input
      className="border px-2 py-1 rounded w-1/2"
      type="text"
      placeholder="Buscar ropa, marcas..."
    />
    <button className="bg-green-500 text-white px-4 py-1 rounded">Vender</button>
  </header>
);

export default Header;
