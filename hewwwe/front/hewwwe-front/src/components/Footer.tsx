import './css/all.css';

function Footer() {
    return (
        <footer className="bg-gray-100 p-5 border-t-2 border-gray-200">
            <div className="container mx-auto text-center">
                <h2 className="text-2xl font-serif text-gray-800 mb-4">Hewwwe</h2>
                <p className="text-gray-600 mb-4">Encuentra las mejores prendas vintage y de segunda mano.</p>
                <nav>
                    <ul className="flex justify-center space-x-6 mb-4">
                        <li><a href="#home" className="text-gray-800 hover:text-blue-500">Inicio</a></li>
                        <li><a href="#shop" className="text-gray-800 hover:text-blue-500">Tienda</a></li>
                        <li><a href="#about" className="text-gray-800 hover:text-blue-500">Nosotros</a></li>
                        <li><a href="#contact" className="text-gray-800 hover:text-blue-500">Contacto</a></li>
                    </ul>
                </nav>
                <p className="text-gray-600">&copy; 2025 Hewwwe. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;