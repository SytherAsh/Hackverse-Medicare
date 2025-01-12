import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [inStockOnly, setInStockOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("priceAsc");

  useEffect(() => {
    const allProducts = [
      // Nutritional Health
      { id: 1, name: 'Protein Powder', price: 2000, image: 'https://cdn.staticans.com/image/tr:e-sharpen-01,h-1500,w-1500,cm-pad_resize/data/Optimum-Nutrition/13-June-2023/1083064_1.jpg', category: 'Nutritional Health', rating: 4.8, reviews: 120, inStock: true },
      { id: 2, name: 'Protein Bar', price: 100, image: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/qst/qst00042/y/62.jpg', category: 'Nutritional Health', rating: 4.6, reviews: 180, inStock: true },
      { id: 3, name: 'Fiber Supplements', price: 700, image: 'https://m.media-amazon.com/images/I/71E8YN5rVYL._AC_UF1000,1000_QL80_.jpghttps://m.media-amazon.com/images/I/71E8YN5rVYL._AC_UF1000,1000_QL80_.jpg', category: 'Nutritional Health', rating: 4.5, reviews: 95, inStock: true },
    
      // Chronic Disease Management
      { id: 4, name: 'Pulse Oximeter', price: 2500, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_IVWGVQqXHVvGSH1p9BDTvPhOeqBbEQ2tdg&s', category: 'Chronic Disease Management', rating: 4.6, reviews: 190, inStock: true },
      { id: 5, name: 'Glucose Meter and Strips', price: 2200, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShD67U99gf627HMzPaGHFwzE1yd9SKrMiB0w&s', category: 'Chronic Disease Management', rating: 4.4, reviews: 120, inStock: true },
      { id: 6, name: 'Blood Pressure Monitor', price: 3000, image: 'https://m.media-amazon.com/images/I/71-qOprKrIL.jpg', category: 'Chronic Disease Management', rating: 4.7, reviews: 210, inStock: true },
      { id: 7, name: 'Glucometer (Diabetes Management)', price: 2700, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4pOGag9rHLEWtGuO0GKw9ssbxLk9f9GFF2w&s', category: 'Chronic Disease Management', rating: 4.5, reviews: 140, inStock: true },
    
      // General Health Monitoring
      { id: 8, name: 'Stethoscope', price: 2500, image: 'https://m.media-amazon.com/images/I/41i+zWBppZL.jpg', category: 'General Health Monitoring', rating: 4.8, reviews: 115, inStock: true },
      { id: 9, name: 'Digital Thermometer', price: 800, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgjIX2dUHaUyXFyC2_l9i4cIe6E-bm9IE3LQ&s', category: 'General Health Monitoring', rating: 4.5, reviews: 300, inStock: true },
    
      // First Aid and Emergency Care
      { id: 10, name: 'Wound Care and Dressings', price: 1500, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0ZsqgfbuxyYR2pwsswieifhsTUIrhmvnLmA&s', category: 'First Aid and Emergency Care', rating: 4.5, reviews: 80, inStock: true },
      { id: 11, name: 'First Aid Kit', price: 2000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS16A2OhEUC7Fi1sxiMClIL9pd7kjR7GX7cLw&s', category: 'First Aid and Emergency Care', rating: 4.8, reviews: 180, inStock: true },
      { id: 12, name: 'Bandages', price: 500, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDJhZM1oA-1OaSlXSnbv5JubmhaL4vtOs43A&s', category: 'First Aid and Emergency Care', rating: 4.4, reviews: 150, inStock: true },
      { id: 13, name: 'Antiseptics and Disinfectants', price: 1200, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp_LwGt5ZzRqFXihCcK8wpD6jf6flwLLNaWQ&s', category: 'First Aid and Emergency Care', rating: 4.7, reviews: 140, inStock: true },
    
      // Assistive Devices and Mobility
      { id: 14, name: 'Wheelchair', price: 12000, image: 'https://m.media-amazon.com/images/I/71lT7f9cyEL._AC_UF1000,1000_QL80_.jpg', category: 'Assistive Devices and Mobility', rating: 4.9, reviews: 200, inStock: true },
      { id: 15, name: 'Hearing Aids and Amplifiers', price: 9000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqjlHEl7ANif3xZIwP12qnmu5fOG89QbOJOA&s', category: 'Assistive Devices and Mobility', rating: 4.6, reviews: 120, inStock: true },
      { id: 16, name: 'Walker', price: 4500, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGOzg_TPY6u91PhdWKkCHDiVzLvcKhbjluew&s', category: 'Assistive Devices and Mobility', rating: 4.7, reviews: 90, inStock: true },
      { id: 17, name: 'Crutches', price: 3500, image: 'https://m.media-amazon.com/images/I/61LIqlycR+L._AC_UF1000,1000_QL80_.jpg', category: 'Assistive Devices and Mobility', rating: 4.4, reviews: 100, inStock: true },
      { id: 18, name: 'Canes and Walking Sticks', price: 2500, image: 'https://www.kid-man.com/aluminium--walking-stick-wooden-handle_prekesbig345148.jpg', category: 'Assistive Devices and Mobility', rating: 4.5, reviews: 80, inStock: true },
    
      // Injury Support
      { id: 19, name: 'Knee and Ankle Brace', price: 1800, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS77LS8e_jPjmqsqI4omziZlQF68bqA_tqFtg&s', category: 'Injury Support', rating: 4.6, reviews: 100, inStock: true },
      { id: 20, name: 'Back Support Belt', price: 2200, image: 'https://m.media-amazon.com/images/I/715l6xlF6HL.jpg', category: 'Injury Support', rating: 4.7, reviews: 150, inStock: true },
      { id: 21, name: 'Compression Stockings and Socks', price: 1500, image: 'https://m.media-amazon.com/images/I/51v3hT0zHiL.jpg', category: 'Injury Support', rating: 4.5, reviews: 90, inStock: true },
    
      // Maternity and Child Care
      { id: 22, name: 'Pregnancy Test Kit', price: 700, image: 'https://images.meesho.com/images/products/289912803/p2wsk_512.webp', category: 'Maternal and Child Care', rating: 4.8, reviews: 150, inStock: true },
      { id: 23, name: 'Maternity and Nursing Pads', price: 1300, image: 'https://m.media-amazon.com/images/I/41d276LggAL.jpg', category: 'Maternal and Child Care', rating: 4.6, reviews: 120, inStock: true },
      { id: 24, name: 'Diapers and Wipes', price: 1000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmqQwETJLnBA8CJmONoB6VZHqhMjD8OA4R7w&s', category: 'Maternal and Child Care', rating: 4.5, reviews: 200, inStock: true },
      { id: 25, name: 'Baby Monitor', price: 9000, image: 'https://cdn.thewirecutter.com/wp-content/media/2023/11/babymonitors-2048px-7889.jpg?auto=webp&quality=75&width=1024', category: 'Maternal and Child Care', rating: 4.9, reviews: 180, inStock: true },
      { id: 26, name: 'Infant Thermometer', price: 2200, image: 'https://m.media-amazon.com/images/I/71IAzZtUelL.jpg', category: 'Maternal and Child Care', rating: 4.7, reviews: 140, inStock: true },
    ];
    

    setProducts(allProducts);
    setFilteredProducts(allProducts);
  }, []);

  // Filter and sort products
  const filterProducts = () => {
    let updatedProducts = products;

    // Category Filter
    if (selectedCategory !== "All") {
      updatedProducts = updatedProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    // In-Stock Filter
    if (inStockOnly) {
      updatedProducts = updatedProducts.filter((product) => product.inStock);
    }

    // Price Range Filter
    if (minPrice) {
      updatedProducts = updatedProducts.filter(
        (product) => product.price >= minPrice
      );
    }
    if (maxPrice) {
      updatedProducts = updatedProducts.filter(
        (product) => product.price <= maxPrice
      );
    }

    // Search Query Filter
    if (searchQuery) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === "priceAsc") {
      updatedProducts = updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
      updatedProducts = updatedProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "ratingDesc") {
      updatedProducts = updatedProducts.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(updatedProducts);
  };

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, inStockOnly, searchQuery, minPrice, maxPrice, sortBy]);

  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 text-yellow-400"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        );
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-blue-600 text-white py-4 shadow-md z-10">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">HealthCare Products</h1>
          <div className="space-x-6">
            <Link to="/" className="hover:text-blue-300 transition">
              Home
            </Link>
            <Link to="/about" className="hover:text-blue-300 transition">
              About
            </Link>
            <Link to="/contact" className="hover:text-blue-300 transition">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg rounded-lg p-5 border border-gray-200 fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-300 pb-3">
          Filters
        </h2>

        {/* Search Bar */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Search Products
          </h3>
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Category</h3>
          <select
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="First Aid and Emergency Care">
              First Aid and Emergency Care
            </option>
            <option value="Chronic Disease Management">
              Chronic Disease Management
            </option>
            <option value="General Health Monitoring">
              General Health Monitoring
            </option>
            <option value="Nutritional Health">
              Nutritional Health
            </option>
            <option value="First aid and emergency care">
              FirstAid and Emergency Care
            </option>
            <option value="Assistive Devices and Mobility">
              Assistive Devices and Mobility
            </option>
            <option value="Injury Support">
              Injury Support
            </option>
            <option value="Maternity and Child Care">
              Maternity and Child Care
            </option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Price Range
          </h3>
          <div className="flex justify-between text-gray-600">
            <input
              type="number"
              className="w-1/2 border border-gray-300 rounded-md px-4 py-2"
              placeholder="Min Price"
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="text-center my-auto">-</span>
            <input
              type="number"
              className="w-1/2 border border-gray-300 rounded-md px-4 py-2"
              placeholder="Max Price"
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Availability Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Availability
          </h3>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 focus:ring focus:ring-blue-500"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            <span className="text-gray-600">In Stock Only</span>
          </label>
        </div>

        {/* Sort By Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Sort By</h3>
          <select
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="ratingDesc">Rating: High to Low</option>
          </select>
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={() => {
            setSelectedCategory("All");
            setInStockOnly(false);
            setMinPrice("");
            setMaxPrice("");
            setSortBy("priceAsc");
            setSearchQuery("");
          }}
          className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
        >
          Reset Filters
        </button>

        <button
          onClick={filterProducts}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mt-4"
        >
          Apply Filters
        </button>
      </aside>

      {/* Product Grid */}
      <div className="flex-1 ml-64 mt-20 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-60 object-contain p-4"
                />
                {!product.inStock && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-sm px-2 py-1 rounded">
                    Out of Stock
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h2>
                <div className="flex items-center space-x-2 mt-2">
                  {renderRatingStars(product.rating)}
                  <span className="text-sm text-gray-500">
                    ({product.reviews} reviews)
                  </span>
                </div>
                <p className="text-gray-700 text-sm mt-2">{product.category}</p>
                <p className="text-gray-600 text-sm mt-1">
                  {product.description}
                </p>
                <p className="text-xl font-bold text-blue-600 mt-4">
                  ₹{product.price}
                </p>
              </div>
              <div className="flex items-center justify-between px-6 py-4 bg-gray-100 rounded-b-xl">
                <Link
                  to={`/product/${product.id}`}
                  className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition"
                >
                  View Details
                </Link>
                <button
                  disabled={!product.inStock}
                  className={`flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition ${
                    !product.inStock
                      ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                      : ""
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
