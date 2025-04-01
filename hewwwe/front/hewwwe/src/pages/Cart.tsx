import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const Cart = () => {
  const { state, dispatch } = useApp();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    } else {
      const item = state.cart.find((i) => i.id === itemId);
      if (item) {
        dispatch({
          type: 'ADD_TO_CART',
          payload: { ...item, quantity: newQuantity },
        });
      }
    }
  };

  const subtotal = state.cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 5.99;
  const total = subtotal + shipping;

  if (state.cart.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-domine text-gray-900 mb-4">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-8">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Link to="/" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {state.cart.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm p-4 flex space-x-4"
          >
            <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
              <img
                src={item.product.images[0]}
                alt={item.product.title}
                className="w-24 h-24 object-cover rounded-md"
              />
            </Link>
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between">
                <Link
                  to={`/product/${item.product.id}`}
                  className="font-medium text-gray-900 hover:text-primary-600"
                >
                  {item.product.title}
                </Link>
                <button
                  onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FiTrash2 />
                </button>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                <span className="capitalize">{item.product.condition}</span>
                <span className="mx-2">•</span>
                <span>{item.product.size}</span>
              </div>
              <div className="mt-auto flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-md hover:bg-gray-100"
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-md hover:bg-gray-100"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
                <span className="font-medium text-gray-900">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="font-domine text-xl font-semibold">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-medium text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => setIsCheckingOut(true)}
            disabled={isCheckingOut}
            className="btn-primary w-full"
          >
            {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
