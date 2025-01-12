import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, List, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const HealthcareHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real application, you would implement the search functionality
    // For now, we'll just navigate to the products page
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <Link to="/" className="text-2xl font-bold text-gray-800">HealthCare Shop</Link>
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </form>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-800">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-gray-800">
                  <List className="inline-block w-5 h-5 mr-1" />
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-gray-800">
                  <ShoppingCart className="inline-block w-5 h-5 mr-1" />
                  Cart
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default HealthcareHeader;

