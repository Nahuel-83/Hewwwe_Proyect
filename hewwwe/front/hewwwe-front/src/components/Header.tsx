import { Link } from 'react-router-dom';
import './css/all.css';

function Header() {
    return (
        <header className="bg-gray-100 p-5 border-b-2 border-gray-200">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-3xl font-serif text-gray-800">Hewwwe</h1>
                <nav>
                    <ul className="flex space-x-6" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        <li><Link to="/" className="text-gray-800 hover:text-blue-500">Inicio</Link></li>
                        <li><Link to="/shop" className="text-gray-800 hover:text-blue-500">Tienda</Link></li>
                        <li><Link to="/about" className="text-gray-800 hover:text-blue-500">Nosotros</Link></li>
                        <li><Link to="/contact" className="text-gray-800 hover:text-blue-500">Contacto</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;