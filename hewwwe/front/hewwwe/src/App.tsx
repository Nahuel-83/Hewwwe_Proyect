import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navigation from './components/Navigation';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import ProductForm from './pages/products/ProductForm';
import CategoriesPage from './pages/categories/CategoriesPage';
import UsersPage from './pages/users/UsersPage';
import CartPage from './pages/cart/CartPage';
import ExchangesPage from './pages/exchanges/ExchangesPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex' }}>
          <Navigation />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route path="/" element={<ProductsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/products/:id/edit" element={<ProductForm />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/:id/cart" element={<CartPage />} />
              <Route path="/exchanges" element={<ExchangesPage />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
      <ToastContainer position="bottom-right" />
    </ThemeProvider>
  );
}

export default App;
