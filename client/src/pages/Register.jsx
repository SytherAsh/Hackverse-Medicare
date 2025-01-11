import React, { useState } from 'react';
import bg from '../assets/1.jpg';
import log from '../assets/login.png';
import { FaFacebookSquare, FaTwitterSquare, FaGithubSquare } from "react-icons/fa";
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username , setUsername] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role , setRole] = useState('');
  const navigate = useNavigate()

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  function handleRedirect(){
    navigate('/login');
  }
  async function handleSubmit(e){
    e.preventDefault();
    const res = await axios.post("http://localhost:3500/auth/register" , {name: username , email , password , role});
    if(res.data){
      handleRedirect();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: `url(${bg})` }}>
      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-3xl shadow-xl p-10 flex items-center space-x-12 max-w-4xl w-full mx-4">
        <div className="hidden sm:flex-1 sm:block">
          <img src={log} alt="room" className="w-full h-80 animate-smooth-bounce" />
          <p className="text-center text-lg font-mono text-white mt-4">Find , Borrow & Enjoy!</p>
        </div>
        <div className="flex-1 relative">
          <div className="bg-white bg-opacity-40 rounded-3xl p-8">
            <div className="flex items-center justify-center mb-6">
              <button onClick={handleRedirect} className="bg-gray-300 text-black px-4 py-2 rounded-l-full shadow-md">Sign In</button>
              <button className="bg-black text-white px-4 py-2 rounded-r-full shadow-md">Sign Up</button>
            </div>
            <h2 className="text-2xl text-white mb-4 text-center">Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-2 relative">
                <input 
                  value={username}
                  type="text" 
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" 
                />
              </div>
              <div className="mb-2 relative">
                <input 
                  value={email}
                  type="email" 
                  placeholder="Email" 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" 
                />
              </div>
              <div className="mb-2 relative flex space-x-4 justify-between text-md">
                <label className="flex items-center justify-center border border-white p-2 rounded-md space-x-2">
                    <input
                        type="radio"
                        name="role"
                        value="Patient"
                        checked={role === 'Patient'}
                        onChange={(e) => setRole(e.target.value)}
                        className="form-radio"
                    />
                    <span>Patient</span>
                </label>
                <label className="flex items-center border justify-center border-white p-2 rounded-md space-x-2 ">
                    <input
                        type="radio"
                        name="role"
                        value="Doctor"
                        checked={role === 'Doctor'}
                        onChange={(e) => setRole(e.target.value)}
                        className="form-radio"
                    />
                    <span>Doctors</span>
                </label>
              </div>
              <div className="mb-2 relative">
                <input 
                  value={password}
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Password" 
                  onChange={(e) => setPassword(e.target.value)}
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
              <button type='submit' className="w-full bg-black hover:border-2  text-white px-4 py-2 rounded-lg">Sign Up</button>
            </form>
            <div className="flex justify-center items-center space-x-3 mt-4 opacity-50">
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

export default Register;