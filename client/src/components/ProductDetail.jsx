import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // In a real application, fetch this data from your backend
    setProduct({
      id: parseInt(id),
      name: 'Fiber Supplements',
      price: 700,
      image: '/placeholder.svg?height=400&width=400',
      description: 'A comprehensive first aid kit for all your emergency needs.',
      rating: 4.5,
      reviews: 95,
      inStock: true,
      category: 'Nutritional Health',
    });
  }, [id]);

  const addToCart = () => {
    // Implement add to cart functionality
    console.log('Added to cart:', product);
  };

  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-5 h-5 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            className="w-5 h-5 text-yellow-400"
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          />
        );
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
      }
    }

    return stars;
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 shadow-lg z-10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <ShoppingCart className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold tracking-wider">HealthCare Store</h1>
          </div>

          {/* Desktop Navbar Links */}
          <div className="hidden md:flex items-center space-x-8 text-lg">
            <Link to="/" className="hover:text-blue-200 transition duration-300">Home</Link>
            <Link to="/about" className="hover:text-blue-200 transition duration-300">About</Link>
            <Link to="/contact" className="hover:text-blue-200 transition duration-300">Contact</Link>
            <Link to="/cart" className="hover:text-blue-200 transition duration-300">
              <ShoppingCart className="w-6 h-6" />
            </Link>
          </div>

          {/* Mobile Navbar Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button className="text-white focus:outline-none">
              <ShoppingCart className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto mt-24 flex flex-col md:flex-row gap-12 p-6">
        {/* Product Image */}
        <div className="md:w-1/2 rounded-lg shadow-lg overflow-hidden">
          <img
            src="https://m.media-amazon.com/images/I/71E8YN5rVYL._AC_UF1000,1000_QL80_.jpg"
            alt={product.name}
            className="w-full h-90 object-contain p-4"
          />
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            {renderRatingStars(product.rating)}
            <span className="text-sm text-gray-500 ml-2">({product.reviews} reviews)</span>
          </div>
          <p className="text-xl text-gray-600 mb-4">₹{product.price.toFixed(2)}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <p className="text-sm text-gray-500 mb-6">Category: {product.category}</p>

          {/* Add to Cart Button */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={addToCart}
              className={`w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
                !product.inStock ? 'bg-gray-400 cursor-not-allowed' : ''
              }`}
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
