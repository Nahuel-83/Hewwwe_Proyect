import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/routes/ProtectedRoute';
import AdminRoute from './components/routes/AdminRoute';
import { theme } from './theme';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import ProductForm from './pages/products/ProductForm';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UserDetailPage from './pages/users/UserDetailPage';
import CartPage from './pages/cart/CartPage';
import ExchangesPage from './pages/exchanges/ExchangesPage';
import AddressesPage from './pages/addresses/AddressesPage';
import AddressForm from './pages/addresses/AddressForm';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminInvoicesPage from './pages/admin/AdminInvoicesPage';
import InvoicesPage from './pages/invoices/InvoicesPage';
import MyProductsPage from './pages/products/MyProductsPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';

// Styles
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';
import AdminUsersPage from './pages/admin/AdminUsersPage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              {/* Public Routes */}
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="my-products" element={<MyProductsPage />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/:id/edit" element={<ProductForm />} />
                <Route path="users/:id" element={<UserDetailPage />} />
                <Route path="users/:id/cart" element={<CartPage />} />
                <Route path="addresses" element={<AddressesPage />} />
                <Route path="addresses/new" element={<AddressForm />} />
                <Route path="addresses/:id/edit" element={<AddressForm />} />
                <Route path="exchanges" element={<ExchangesPage />} />
                <Route path="invoices" element={<InvoicesPage />} />
              </Route>
              
              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="admin/categories" element={<AdminCategoriesPage />} />
                <Route path="admin/users" element={<AdminUsersPage />} />
                <Route path="admin/invoices" element={<AdminInvoicesPage />} />
                <Route path="admin/products" element={<AdminProductsPage />} />
                <Route path="admin/invoices" element={<AdminInvoicesPage />} />
              </Route>
            </Route>
          </Routes>
          <ToastContainer position="bottom-right" />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
