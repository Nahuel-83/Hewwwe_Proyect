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

// Components
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-nunito">
      <Header />
      <main className="container mx-auto px-4 py-8">
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
          <Route path="/sell" element={
            <ProtectedRoute>
              <SellItem />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
};

export default App;
