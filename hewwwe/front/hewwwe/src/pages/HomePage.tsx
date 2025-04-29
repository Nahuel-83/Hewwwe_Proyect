import { Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ShoppingCart, CompareArrows } from '@mui/icons-material';
import '../styles/pages/HomePage.css';

export default function HomePage() {
  return (
    <div className="home-container">
      <div className="home-content">
        <Typography variant="h1" className="home-title">
          Bienvenido a Hewwwe
        </Typography>
        <Typography variant="h5" className="home-subtitle">
          Tu plataforma de compra e intercambio
        </Typography>
        
        <div className="home-buttons">
          <Button
            variant="contained"
            component={RouterLink}
            to="/products"
            startIcon={<ShoppingCart />}
            className="home-button"
          >
            Explorar Productos
          </Button>
          <Button
            variant="outlined"
            component={RouterLink}
            to="/exchanges"
            startIcon={<CompareArrows />}
            className="home-button"
          >
            Ver Intercambios
          </Button>
        </div>
      </div>
    </div>
  );
}
