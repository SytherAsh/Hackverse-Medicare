import React from 'react';
import FlipCard from '../components/FlipCard';
import SideBarComp from '../components/SideBarComp';

function Booking() {
  const products = [
    {
      id: 1,
      name: 'Digital Thermometer',
      category: 'Medical Equipment',
      price: '1599',
      description: 'Accurate and fast temperature reading, ideal for home use.',
      image: 'thermometer.jpg',
    },
    {
      id: 2,
      name: 'Stethoscope',
      category: 'Medical Equipment',
      price: '499',
      description: 'High-quality stethoscope for doctors and medical professionals.',
      image: 'stethoscope.jpg',
    },
  ];

  return (
    <div className="flex">
      <SideBarComp />
      <div className="flex-grow p-4 m-3 mt-24">
        <h2 className="text-3xl text-center text-orange-400 font-bold mb-8">Shop for Medical Equipment</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {products.length > 0 ? (
            products.map(product => (
              <FlipCard key={product.id} product={product} />
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Booking;
