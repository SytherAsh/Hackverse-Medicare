import React, { useContext, useState } from 'react';
import bg from '../assets/1.jpg';
import log from '../assets/login.png';
import { FaFacebookSquare, FaTwitterSquare, FaGithubSquare } from "react-icons/fa";
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { UserContext } from '../UserContext';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {login} = useContext(UserContext)

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleSubmit(e){
    e.preventDefault();
    const res = await axios.post("http://localhost:3500/auth/login" , {email , password });
    if(res.data){
      // console.log(res.data);
      const userData = res.data.user;
      // console.log("login",userData);
      const token = res.data.accessToken;
      localStorage.setItem('token', token);
      login(userData);
      navigate('/dashboard');
    }
  }

  function handleRedirect() {
    navigate('/register');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: `url(${bg})` }}>
      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-3xl shadow-xl p-10 flex items-center space-x-12 max-w-4xl w-full mx-4 ">
        <div className="hidden sm:flex-1 sm:block">
          <img src={log} alt="room" className="w-full h-80 animate-smooth-bounce" />
          <p className="text-center text-lg font-mono text-white mt-4">Find, Borrow & Enjoy!</p>
        </div>
        <div className="flex-1 relative">
          <div className="bg-white bg-opacity-40 rounded-3xl p-8">
            <div className="flex items-center justify-center mb-6">
              <button className="bg-black text-white px-4 py-2 rounded-l-full shadow-md">Sign In</button>
              <button onClick={handleRedirect} className="bg-gray-300 text-black px-4 py-2 rounded-r-full shadow-md">Sign Up</button>
            </div>
            <h2 className="text-2xl text-white mb-6 text-center">Sign In</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 relative">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="mb-4 relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <span
                  className="absolute right-3 top-1 cursor-pointer"
                  onClick={handlePasswordVisibility}
                >
                  {showPassword ? <BsEyeSlash className="text-gray-500 mt-2" /> : <BsEye className="text-gray-500 mt-2" />}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <a href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
              </div>
              <button type="submit" className="w-full bg-black hover:border-2 text-white px-4 py-2 rounded-lg">Sign In</button>
            </form>
            <div className="flex justify-center items-center space-x-3 mt-6 opacity-50">
              <a href="#" className="text-white"><FaFacebookSquare size={24} /></a>
              <a href="#" className="text-white"><FaTwitterSquare size={24} /></a>
              <a href="#" className="text-white"><FaGithubSquare size={24} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;