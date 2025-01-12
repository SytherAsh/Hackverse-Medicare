import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Simulating fetching cart data from a backend or state management
    setCartItems([
      { id: 1, name: 'First Aid Kit', price: 29.99, quantity: 1 },
      { id: 2, name: 'Digital Thermometer', price: 19.99, quantity: 2 },
    ]);
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-indigo-800 text-white py-6 shadow-md z-10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ShoppingCart className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold">HealthCare Store</h1>
          </div>
          <div className="hidden md:flex space-x-8 text-lg">
            <Link to="/" className="hover:text-indigo-400 transition">Home</Link>
            <Link to="/about" className="hover:text-indigo-400 transition">About</Link>
            <Link to="/contact" className="hover:text-indigo-400 transition">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Cart Details */}
      <div className="max-w-7xl mx-auto mt-28 px-6 py-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white shadow-xl rounded-lg p-8 text-center text-gray-600">
            <p className="text-xl">Your cart is empty.</p>
            <Link to="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-400 font-medium">Start Shopping</Link>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white shadow-lg rounded-lg p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="bg-white shadow-lg rounded-lg p-6 mt-8 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Total:</h2>
              <p className="text-xl font-semibold text-gray-800">${total.toFixed(2)}</p>
            </div>

            {/* Proceed to Checkout Button */}
            <Button className="mt-8 w-full bg-indigo-700 hover:bg-indigo-800 text-white py-3 px-6 rounded-lg font-medium transition duration-300">
              Proceed to Checkout
            </Button>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-indigo-800 text-white text-center py-4 mt-24">
        <p className="text-sm">© 2025 HealthCare Store. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Cart;
