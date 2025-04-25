import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navigation from './components/Navigation';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import ProductForm from './pages/products/ProductForm';
import CategoriesPage from './pages/categories/CategoriesPage';
import CategoryForm from './pages/categories/CategoryForm';
import UsersPage from './pages/users/UsersPage';
import UserForm from './pages/users/UserForm';
import CartPage from './pages/cart/CartPage';
import ExchangesPage from './pages/exchanges/ExchangesPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';
import { ThemeProvider as CustomThemeProvider, useTheme } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import AddressesPage from './pages/addresses/AddressesPage';
import AddressForm from './pages/addresses/AddressForm';
import CategoryDetail from './pages/categories/CategoryDetail';

const AppContent = () => {
  const { mode } = useTheme();

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#f8f9fa',
        light: '#669bbc',
        dark: '#000000',
      },
      secondary: {
        main: '#c1121f',
        light: '#fdf0d5',
      },
      background: {
        default: mode === 'light' ? '#f8f9fa' : '#212529',
        paper: mode === 'light' ? '#fff' : '#000000',
      },
      text: {
        primary: mode === 'light' ? '#003049' : '#fdf0d5',
        secondary: mode === 'light' ? '#669bbc' : '#c1121f',
      },
    },
    typography: {
      fontFamily: 'Nunito, Arial, sans-serif',
      h1: { fontFamily: 'Domine, serif' },
      h2: { fontFamily: 'Domine, serif' },
      h3: { fontFamily: 'Domine, serif' },
      h4: { fontFamily: 'Domine, serif' },
      h5: { fontFamily: 'Domine, serif' },
      h6: { fontFamily: 'Domine, serif' },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Navigation />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <ThemeToggle />
            <Routes>
              {/* Product routes */}
              <Route path="/" element={<ProductsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/products/:id/edit" element={<ProductForm />} />
              
              {/* Category routes */}
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/new" element={<CategoryForm />} />
              <Route path="/categories/:id" element={<CategoryDetail />} />
              <Route path="/categories/:id/edit" element={<CategoryForm />} />
              
              {/* User routes */}
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/new" element={<UserForm />} />
              <Route path="/users/:id/edit" element={<UserForm />} />
              <Route path="/users/:id/cart" element={<CartPage />} />
              
              {/* Cart route */}
              <Route path="/cart" element={<CartPage />} />
              
              {/* Exchanges route */}
              <Route path="/exchanges" element={<ExchangesPage />} />

              {/* Address routes */}
              <Route path="/addresses" element={<AddressesPage />} />
              <Route path="/addresses/new" element={<AddressForm />} />
              <Route path="/addresses/:id/edit" element={<AddressForm />} />
            </Routes>
          </Box>
        </Box>
      </Router>
      <ToastContainer position="bottom-right" />
    </ThemeProvider>
  );
};

function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}

export default App;
