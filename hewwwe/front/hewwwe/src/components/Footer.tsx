import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-md mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand and Description */}
          <div>
            <h3 className="font-domine text-xl font-bold mb-4">HEWWWE</h3>
            <p className="text-gray-600">
              Your marketplace for second-hand sneakers and clothing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/swap" className="text-gray-600 hover:text-gray-900">
                  Swap Items
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-gray-600 hover:text-gray-900">
                  Sell Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-600">Email: contact@hewwwe.com</li>
              <li className="text-gray-600">Phone: (123) 456-7890</li>
              <li className="text-gray-600">
                Address: 123 Fashion St, Style City
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} HEWWWE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
