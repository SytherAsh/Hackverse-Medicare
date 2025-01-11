import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default Home;
