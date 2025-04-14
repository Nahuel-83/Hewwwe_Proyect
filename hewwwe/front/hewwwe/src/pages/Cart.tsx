import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types/Product';
import '../styles/cart.css';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  // Mock cart data - in a real app, this would come from a cart context or API
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleRemoveFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCartItems([]);
      alert('Checkout successful!');
      navigate('/');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="empty-cart-animation inline-block mb-8">
          <svg
            className="w-24 h-24 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-domine font-bold mb-4 bg-gradient-to-r from-black to-gray-700 text-transparent bg-clip-text">
          Your Cart is Empty
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Start shopping to add items to your cart!
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-domine font-bold mb-8 text-center sm:text-left bg-gradient-to-r from-black to-gray-700 text-transparent bg-clip-text">
        Shopping Cart
      </h2>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="space-y-6">
          {cartItems.map(item => (
            <div 
              key={item.productId} 
              className="cart-item flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100"
            >
              <div className="relative w-full sm:w-32 h-32">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg shadow-sm"
                />
                <span className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs">
                  {item.size}
                </span>
              </div>
              
              <div className="flex-grow text-center sm:text-left">
                <h3 className="font-domine font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <p className="price-tag text-xl">${item.price.toLocaleString()}</p>
              </div>
              
              <button
                onClick={() => handleRemoveFromCart(item.productId)}
                className="remove-button px-4 py-2 text-red-500 hover:text-red-700 border border-red-500 rounded-lg text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <span className="text-lg">Total Amount:</span>
            <span className="price-tag text-3xl">${total.toLocaleString()}</span>
          </div>
          
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="checkout-button w-full bg-black text-white py-4 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isCheckingOut ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              'Proceed to Checkout'
            )}
          </button>
          
          <p className="text-center text-gray-500 text-sm mt-4">
            Secure checkout powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
