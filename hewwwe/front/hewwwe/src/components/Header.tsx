import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
  <header className="bg-white shadow-md p-4 flex justify-between items-center">
    <div className="flex flex-col">
      <Link to="/" className="text-2xl font-bold font-domine text-black">HEWWWE</Link>
      <span className="text-sm font-nunito text-gray-600">Tres veces imparable</span>
    </div>
    <input
      className="border px-2 py-1 rounded w-1/2"
      type="text"
      placeholder="Buscar ropa, marcas..."
    />
    <button className="bg-green-500 text-white px-4 py-1 rounded">Vender</button>
  </header>
);

export default Header;
