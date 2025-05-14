import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';

// Import SVG icons
const CartIcon = (): React.ReactElement => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const UserIcon = (): React.ReactElement => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MenuIcon = (): React.ReactElement => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

interface DropdownStyle {
  display: 'block';
  padding: string;
  color: string;
  fontFamily: string;
  fontSize: string;
  textDecoration: 'none';
  transition: string;
}

interface DropdownButtonStyle extends DropdownStyle {
  width: '100%';
  textAlign: 'left';
  border: 'none';
  backgroundColor: 'transparent';
  cursor: 'pointer';
}

interface MobileButtonStyle {
  width: '100%';
  textAlign: 'left';
  background: 'none';
  border: 'none';
  cursor: 'pointer';
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  color: string;
  padding: string;
}

export default function Navbar(): React.ReactElement {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);
  const location = useLocation();

  const isActive = (path: string): boolean => location.pathname === path;

  const toggleMobileMenu = (): void => {
    setShowMobileMenu(!showMobileMenu);
    setShowUserDropdown(false);
  };

  const toggleUserDropdown = (): void => {
    setShowUserDropdown(!showUserDropdown);
    setShowMobileMenu(false);
  };

  const dropdownItemStyle: DropdownStyle = {
    display: 'block',
    padding: '0.5rem 1rem',
    color: '#4a4e4a',
    fontFamily: "'Nunito', sans-serif",
    fontSize: '0.9375rem',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease'
  };

  const dropdownButtonStyle: DropdownButtonStyle = {
    ...dropdownItemStyle,
    width: '100%',
    textAlign: 'left',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer'
  };

  const mobileButtonStyle: MobileButtonStyle = {
    width: '100%',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 600,
    fontSize: '1rem',
    color: '#606158',
    padding: '0.75rem'
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Hewwwe</Link>
      
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
        <MenuIcon />
      </button>
      
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Inicio
          </Link>
        </li>
        
        {!isAdmin && (
          <li className="nav-item">
            <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
              Productos
            </Link>
          </li>
        )}
        
        {isAdmin && (
          <>
            <li className="nav-item">
              <Link to="/admin/products" className={`nav-link ${isActive('/admin/products') ? 'active' : ''}`}>
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/categories" className={`nav-link ${isActive('/admin/categories') ? 'active' : ''}`}>
                Categorías
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/users" className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}>
                Usuarios
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/exchanges" className={`nav-link ${isActive('/admin/exchanges') ? 'active' : ''}`}>
                Intercambios
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/invoices" className={`nav-link ${isActive('/admin/invoices') ? 'active' : ''}`}>
                Facturas
              </Link>
            </li>
          </>
        )}
      </ul>
      
      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            <Link 
              to={`/users/${user?.userId}/cart`}
              className="navbar-action"
              aria-label="Cart"
            >
              <CartIcon />
            </Link>
            
            <div style={{ position: 'relative' }}>
              <button 
                className="navbar-action" 
                onClick={toggleUserDropdown}
                aria-label="User menu"
              >
                <UserIcon />
              </button>
              
              {showUserDropdown && (
                <div className="dropdown-menu" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: '#ffffff',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
                  minWidth: '160px',
                  zIndex: 1000,
                  padding: '0.5rem 0'
                }}>
                  <Link 
                    to={`/users/${user?.userId}`}
                    className="dropdown-item"
                    style={dropdownItemStyle}
                  >
                    Mi Perfil
                  </Link>
                  <Link 
                    to="/my-products"
                    className="dropdown-item"
                    style={dropdownItemStyle}
                  >
                    Mis Productos
                  </Link>
                  <Link 
                    to="/my-addresses"
                    className="dropdown-item"
                    style={dropdownItemStyle}
                  >
                    Mis Direcciones
                  </Link>
                  <button 
                    onClick={logout}
                    className="dropdown-item"
                    style={dropdownButtonStyle}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-text">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="btn btn-primary">
              Registrarse
            </Link>
          </>
        )}
      </div>
      
      {showMobileMenu && (
        <div className="mobile-menu active">
          <Link to="/" className="nav-link" onClick={toggleMobileMenu}>
            Inicio
          </Link>
          
          {!isAdmin && (
            <Link to="/products" className="nav-link" onClick={toggleMobileMenu}>
              Productos
            </Link>
          )}
          
          {isAdmin && (
            <>
              <Link to="/admin/products" className="nav-link" onClick={toggleMobileMenu}>
                Productos
              </Link>
              <Link to="/admin/categories" className="nav-link" onClick={toggleMobileMenu}>
                Categorías
              </Link>
              <Link to="/admin/users" className="nav-link" onClick={toggleMobileMenu}>
                Usuarios
              </Link>
              <Link to="/admin/exchanges" className="nav-link" onClick={toggleMobileMenu}>
                Intercambios
              </Link>
              <Link to="/admin/invoices" className="nav-link" onClick={toggleMobileMenu}>
                Facturas
              </Link>
            </>
          )}
          
          {isAuthenticated ? (
            <>
              <Link to={`/users/${user?.userId}`} className="nav-link" onClick={toggleMobileMenu}>
                Mi Perfil
              </Link>
              <Link to="/my-products" className="nav-link" onClick={toggleMobileMenu}>
                Mis Productos
              </Link>
              <Link to="/my-addresses" className="nav-link" onClick={toggleMobileMenu}>
                Mis Direcciones
              </Link>
              <Link to={`/users/${user?.userId}/cart`} className="nav-link" onClick={toggleMobileMenu}>
                Mi Carrito
              </Link>
              <button 
                className="nav-link"
                style={mobileButtonStyle}
                onClick={() => {
                  logout();
                  toggleMobileMenu();
                }}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={toggleMobileMenu}>
                Iniciar Sesión
              </Link>
              <Link to="/register" className="nav-link" onClick={toggleMobileMenu}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
} 