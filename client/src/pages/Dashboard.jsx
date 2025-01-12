import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SideBarComp from "../components/SideBarComp";
import { ThemeContext } from "../ThemeContext";
import { UserContext } from "../UserContext";
import Chatbot from "../components/Chatbot";
import MoodScoreGraph from "../components/MoodScore";
import { BsBell } from "react-icons/bs";
import c1 from "../assets/c1.svg";
import c2 from "../assets/c2.svg";
import bg from "../assets/big.jpg";
import vid from "../assets/siren-253181.mp3";
import axios from "axios";

function Dashboard() {
  const { theme } = useContext(ThemeContext);
  const { user, ready } = useContext(UserContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [thought, setThought] = useState("");

  const audio = new Audio(vid); // Create Audio instance for siren sound

  useEffect(() => {
    // Fetch thought for the user
    const fetchThought = async () => {
      try {
        const res = await axios.get("http://localhost:3500/api/affirmations");
        if (res.data) {
          setThought(res.data);
        }
      } catch (error) {
        console.error("Error fetching affirmations:", error);
      }
    };

    fetchThought();

    // Set greeting based on the time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const callEmergency = async () => {
    try {
      const res = await axios.post("http://localhost:3500/call");
      if (res) {
        alert("Emergency Call Initiated");
        audio.play(); // Play siren sound
      }
    } catch (error) {
      console.error("Error during emergency call:", error);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  if (!ready) return <div>Loading...</div>;
  if (!user) return <div>User not found. Please log in again.</div>;

  return (
    <div className={`flex ${theme === "light" ? "" : "bg-black text-white"}`}>
      <SideBarComp />
      <div
        className={`p-4 w-full overflow-hidden mt-[76px] ${
          theme === "light" ? "" : "bg-black text-white"
        }`}
      >
        {/* Upper Section */}
        <div
          className="rounded-2xl p-6 h-52 mb-6 flex flex-col items-center md:flex-row justify-center bg-cover bg-center relative"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <div className="text-center md:text-left md:flex-1 ml-8">
            <h2 className="text-black text-3xl font-bold mb-2">
              {greeting}, {user.name}
            </h2>
            <p className="text-black text-md mb-4">{thought}</p>
          </div>
        </div>

        {/* Features Section */}
        <div
          className={`grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 ${
            theme === "light" ? "" : "text-black"
          }`}
        >
          <Link
            to="/map"
            className="bg-yellow-100 p-4 rounded-3xl flex items-center justify-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400"
          >
            <h4 className="text-xl font-semibold ml-10">Hospitals near me</h4>
            <img src={c2} alt="Hospitals" className="w-56 h-56 mx-4" />
          </Link>

          <Link
            to="/booking"
            className="bg-green-100 p-4 rounded-3xl flex items-center justify-between shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400"
          >
            <h4 className="text-xl font-semibold">Report Analysis</h4>
            <img src={c1} alt="Report Analysis" className="w-56 h-56 mx-4" />
          </Link>

          <Link
            to="/event"
            className="bg-purple-100 p-4 rounded-3xl flex items-center justify-between shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400"
          >
            <h4 className="text-xl font-semibold">EventExpress</h4>
            <img src={c2} alt="EventExpress" className="w-56 h-56 mr-32" />
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mb-4">
          <div className="bg-pink-100 p-4 rounded-3xl h-64 w-80 ml-32 flex items-center justify-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
            <h4 className="text-xl font-semibold text-center">
              Events Attended
            </h4>
            <p className="text-sm text-center">2</p>
          </div>

          <div className="bg-red-100 p-4 rounded-3xl h-64 w-80 flex items-center justify-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
            <h4 className="text-xl font-semibold text-center">
              Appointments Booked
            </h4>
            <p className="text-sm text-center">1</p>
          </div>
        </div>

        {/* Chat and Emergency Buttons */}
        <div>
          <button
            onClick={toggleChat}
            className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Open Chat
          </button>
          {isChatOpen && <Chatbot />}
        </div>

        <div>
          <button
            className="fixed bottom-4 left-4 bg-red-700 text-white p-3 rounded-full shadow-lg hover:bg-yellow-600 transition-colors duration-300 z-10"
            onClick={callEmergency}
          >
            <BsBell className="h-10 w-10" />
          </button>
        </div>

        {/* Mood Graph */}
        <MoodScoreGraph />
      </div>
    </div>
  );
}

export default Dashboard;
