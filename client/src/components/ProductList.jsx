import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // In a real application, you would fetch this data from your Django backend
    setProducts([
      { id: 1, name: 'First Aid Kit', price: 29.99, image: '/placeholder.svg?height=200&width=200' },
      { id: 2, name: 'Digital Thermometer', price: 19.99, image: '/placeholder.svg?height=200&width=200' },
      { id: 3, name: 'Hand Sanitizer', price: 4.99, image: '/placeholder.svg?height=200&width=200' },
    ]);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Featured Healthcare Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
              <div className="flex justify-between items-center">
                <Link to={`/product/${product.id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
                <Button>Add to Cart</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link to="/products">
          <Button size="lg">View All Products</Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductList;

