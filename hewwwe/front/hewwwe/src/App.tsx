import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '@fontsource/domine/700.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';

// Pages
import Home from './pages/Home';
import Product from './pages/Product';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import SellItem from './pages/SellItem';
import Cart from './pages/Cart';
import Swap from './pages/Swap';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Context
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 font-nunito">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute>
                <SellItem />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/swap" element={
              <ProtectedRoute>
                <Swap />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
