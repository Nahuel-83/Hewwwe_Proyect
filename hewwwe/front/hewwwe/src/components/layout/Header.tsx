import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiLogIn } from 'react-icons/fi';
import { getCurrentUser } from '../../services/api';

const Header = () => {
  const user = getCurrentUser();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-domine font-bold text-blue-500">Hewwwe</h1>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for items..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link
              to="/favorites"
              className="text-gray-600 hover:text-blue-500 transition-colors p-2"
              title="Favorites"
            >
              <FiHeart size={20} />
            </Link>

            <Link
              to="/cart"
              className="text-gray-600 hover:text-blue-500 transition-colors p-2"
              title="Cart"
            >
              <FiShoppingCart size={20} />
            </Link>

            {user ? (
              <Link
                to="/profile"
                className="text-gray-600 hover:text-blue-500 transition-colors p-2"
                title="Profile"
              >
                <FiUser size={20} />
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-500 transition-colors p-2"
                title="Login"
              >
                <FiLogIn size={20} />
              </Link>
            )}

            {user && (
              <Link
                to="/sell"
                className="hidden md:block btn-primary"
              >
                Sell Now
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden py-4">
          <input
            type="text"
            placeholder="Search for items..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
