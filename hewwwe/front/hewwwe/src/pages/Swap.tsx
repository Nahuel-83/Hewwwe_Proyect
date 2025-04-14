import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types/Product';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/product.service';
import '../styles/swap.css';

const Swap: React.FC = () => {
  const { user } = useAuth();
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedUserProduct, setSelectedUserProduct] = useState<Product | null>(null);
  const [selectedSwapProduct, setSelectedSwapProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await productService.getAllProducts();
        // Mock filtering - in a real app, this would be done by the backend
        if (user) {
          setUserProducts(allProducts.filter(p => p.userId === parseInt(user.id)));
          setAvailableProducts(allProducts.filter(p => p.userId !== parseInt(user.id)));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const handleProposeSwap = async () => {
    if (!selectedUserProduct || !selectedSwapProduct) {
      alert('Please select products to swap');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Swap proposal sent successfully!');
      setSelectedUserProduct(null);
      setSelectedSwapProduct(null);
    } catch (error) {
      console.error('Error proposing swap:', error);
      alert('Failed to propose swap. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        <p className="mt-4 text-lg text-gray-600">Loading available items...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-domine font-bold mb-8 text-center bg-gradient-to-r from-black to-gray-700 text-transparent bg-clip-text">
        Swap Your Items
      </h2>

      <div className="grid md:grid-cols-2 gap-8 relative">
        {/* Your Items */}
        <div className="swap-section bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-domine font-bold mb-6 text-center md:text-left">
            Your Items
          </h3>
          {userProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-gray-600 text-lg">You don't have any items to swap</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {userProducts.map(product => (
                <div
                  key={product.productId}
                  onClick={() => setSelectedUserProduct(product)}
                  className={`swap-item cursor-pointer ${
                    selectedUserProduct?.productId === product.productId
                      ? 'selected ring-2 ring-black'
                      : ''
                  }`}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap Arrow for medium and larger screens */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="swap-arrow bg-black text-white p-4 rounded-full">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        </div>

        {/* Available Items */}
        <div className="swap-section bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-domine font-bold mb-6 text-center md:text-left">
            Available for Swap
          </h3>
          {availableProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <p className="text-gray-600 text-lg">No items available for swap</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {availableProducts.map(product => (
                <div
                  key={product.productId}
                  onClick={() => setSelectedSwapProduct(product)}
                  className={`swap-item cursor-pointer ${
                    selectedSwapProduct?.productId === product.productId
                      ? 'selected ring-2 ring-black'
                      : ''
                  }`}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Swap Action */}
      {(selectedUserProduct || selectedSwapProduct) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-6 border-t border-gray-200 z-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col md:flex-row items-center gap-4 text-lg">
                {selectedUserProduct && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Your Item:</span>
                    <span className="text-gray-700">{selectedUserProduct.name}</span>
                  </div>
                )}
                {selectedUserProduct && selectedSwapProduct && (
                  <span className="hidden md:block text-2xl">⟷</span>
                )}
                {selectedSwapProduct && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Their Item:</span>
                    <span className="text-gray-700">{selectedSwapProduct.name}</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleProposeSwap}
                disabled={!selectedUserProduct || !selectedSwapProduct}
                className="swap-button w-full md:w-auto text-white px-8 py-3 rounded-lg text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Propose Swap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Swap;
