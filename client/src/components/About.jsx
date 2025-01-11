import React from 'react';
import { useNavigate } from 'react-router-dom';
import l from '../assets/logo.png'

const About = () => {
    const navigate = useNavigate();
    
    const handleClick = (path) => {
        navigate(path);
    };
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#cfc2cb] to-[#aba4da] text-white flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-8 text-black">ABOUT US</h1>
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        
        {/* Image Section */}
        <div className="flex justify-center lg:w-1/2">
          <div className=" rounded-full overflow-hidden flex items-center justify-center">
            <img
              src={l} // Replace with your image URL
              alt="About Us"
              className="w-80 h-80 object-contain"
            />
          </div>
        </div>
        
        {/* Text Section */}
        <div className="lg:w-1/2 px-6 lg:px-0 text-center lg:text-left">
          <p className="text-gray-700 text-lg font-serif mb-6 mr-8">
          BeyondCare - Our progressive web app offers a suite of tools for mental and physical health support. With resources like mood and physical health tracking, mental health assessments, personalized therapy plans, wellness content, and crisis support, users have comprehensive resources to address their wellness needs.
          </p>
          <p className="text-gray-700 mb-10 mr-8 font-serif">
          Healthcare providers can connect with patients to support and manage their wellness journeys.
          </p>
          <button onClick={() => handleClick('/register')} className="bg-transparent border-2 border-cyan-500 text-cyan-500 py-2 px-6 rounded-full hover:bg-cyan-500 hover:text-gray-900 transition duration-300">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
