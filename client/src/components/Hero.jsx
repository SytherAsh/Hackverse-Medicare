import React from 'react';
import bg from '../assets/landing.jpg';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';
//import sectionImage from '../assets/image.png'; // Replace with the correct path to your uploaded image

const Hero = ({ scrollToSection, refs }) => {
    const navigate = useNavigate();
    function handleClick(path){
        navigate(path);
    }
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
            style={{ backgroundImage: `url(${bg})` }}
        >
            {/* <nav className="absolute top-5 right-10 flex space-x-8 text-[#4f4f8b] font-semibold text-sm">
                <a href="#" className="text-xl hover:underline">About Us</a>
                <a href="#" className="text-xl hover:underline">Features</a>
                <a href="#" className="text-xl hover:underline">Contact Us</a>
            </nav> */}
            <Navbar scrollToSection={scrollToSection} refs={refs} />
            {/* Overlay Section in Top Left */}
            <div className="absolute top-10 left-10  bg-opacity-80 p-8 rounded-lg max-w-xs">
                {/* Text Content */}
                <div className="mt-8">
                    <h2 className="text-5xl mb-6 font-bold text-[#4f4f8b]">Mental Wellness</h2>
                    <p className="mt-2 text-[#6b6b7b] text-sm">
                    Transforming Healthcare and Wellness, Beyond Boundaries .Empowering you with comprehensive tools for your holistic well-being.
                    </p>
                    <div className="flex space-x-8 mt-6">
                        <button onClick={() => handleClick("/register")} className="bg-[#e1e6f9] text-[#4f4f8b] py-2 px-4 rounded-full font-semibold">Join us</button>
                        <button onClick={() => handleClick("/register")}  className="bg-[#d1e6db] text-[#4f4f8b] py-2 px-4 rounded-full font-semibold">Sign in</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
