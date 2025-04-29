import { AppBar, Toolbar, Button, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { AccountCircle, ShoppingCart } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import '../styles/Navigation.css';

export default function Navigation() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="fixed" color="inherit" elevation={0}>
      <Toolbar className="nav-container">
        <div className="nav-menu">
          <Button
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            component={RouterLink}
            to="/"
          >
            Inicio
          </Button>
          <Button
            className={`nav-link ${isActive('/products') ? 'active' : ''}`}
            component={RouterLink}
            to="/products"
          >
            Productos
          </Button>
          {isAdmin && (
            <>
              <Button className="nav-link" component={RouterLink} to="/admin/categories">
                Categorías
              </Button>
              <Button className="nav-link" component={RouterLink} to="/admin/users">
                Usuarios
              </Button>
            </>
          )}
        </div>

        <div className="nav-user-section">
          {isAuthenticated ? (
            <>
              <IconButton
                className="nav-icon-button"
                component={RouterLink}
                to={`/users/${user?.userId}/cart`}
                size="large"
              >
                <ShoppingCart />
              </IconButton>
              <IconButton
                className="nav-icon-button"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                size="large"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1.5,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem component={RouterLink} to={`/users/${user?.userId}`}>
                  Mi Perfil
                </MenuItem>
                <MenuItem component={RouterLink} to="/my-products">
                  Mis Productos
                </MenuItem>
                <MenuItem component={RouterLink} to="/exchanges">
                  Intercambios
                </MenuItem>
                <MenuItem onClick={logout}>Cerrar Sesión</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Iniciar Sesión
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Registrarse
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
