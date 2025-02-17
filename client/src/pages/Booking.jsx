import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SideBarComp from "../components/SideBarComp";
import { ThemeContext } from "../THemeContext";
import QuizPopup from "../components/Quiz";
import c1 from "../assets/c1.svg";
import c2 from "../assets/c2.svg";
import bg from "../assets/big.jpg";
import { UserContext } from "../UserContext";
import axios from "axios";
import Chatbot from "../components/Chatbot";
import { CiMobile2 } from "react-icons/ci";
import { BsBell } from "react-icons/bs";
import MoodScoreGraph from "../components/MoodSchore";
import vid from "../assets/siren-253181.mp3";

function Dashboard() {
  const { theme } = useContext(ThemeContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const { user, ready } = useContext(UserContext);
  const [thought, setThought] = useState("");
  const [plan, setPlan] = useState("");

  const audio = new Audio(vid); // Create Audio instance with the audio file

  useEffect(() => {
    const fetchThought = async () => {
      const res = await axios.get("http://localhost:3500/api/affirmations");
      if (res.data) {
        setThought(res.data);
      }
    };

    fetchThought();

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  async function handleClick() {
    const res = await axios.get(
      `http://10.240.13.126:8000/api/journals/report/${user._id}/`
    );
    const emailres = await axios.post("http://localhost:3500/report", {
      summary: res.data.summary,
    });
    if (res.data) {
      setPlan(res.data.summary);
    }
  }

  async function callEmergency() {
    const res = await axios.post("http://localhost:3500/call");

    const messageData = {
      contactNumbers: ["+919152602555"], // Replace with your contact numbers array
      messageBody: "Emergency Alert! I need help. My current location is:",
    };

    if (res) {
      alert("Emergency Call Initiated");
      audio.play(); // Play the siren sound when emergency is called
    }
  }

  if (!ready) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found. Please log in again.</div>;
  }

  return (
    <div className={`flex ${theme === "light" ? "" : "bg-black text-white"}`}>
      {/* <QuizPopup /> */}
      <SideBarComp />
      <div
        className={`p-4 w-full overflow-hidden mt-[76px] ${
          theme === "light" ? "" : "bg-black text-white"
        }`}
      >
        <button
          onClick={() =>
            window.open("http://127.0.0.1:8000/chatbot/upload", "_blank")
          }
          className="p-3 px-6 mb-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-700 transition-transform transform hover:scale-105"
        >
          upload report
        </button>

        <div
          className={`grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 ${
            theme === "light" ? "" : "text-black"
          }`}
        >
          <button
            onClick={() =>
              window.open("http://127.0.0.1:8000/chatbot/diet", "_blank")
            }
            className="bg-yellow-100 p-4 rounded-3xl flex items-center justify-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400"
          >
            <div className="text-left flex-1 ml-8">
              <h4 className="text-xl font-semibold ml-10">Diet Planner</h4>
            </div>
            <img src={c2} alt="Diet Planner" className="w-56 h-56 mx-4" />
          </button>

          <button
            onClick={() =>
              window.open("http://127.0.0.1:8000/chatbot/equipment", "_blank")
            }
            className="bg-purple-100 p-4 rounded-3xl flex items-center justify-between shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400"
          >
            <div className="text-left flex-1 ml-2">
              <h4 className="text-xl font-semibold">Equipment Suggestions</h4>
            </div>
            <img src={c2} alt="Connect" className="w-56 h-56 mr-32" />
          </button>

          <button
            onClick={() =>
              window.open("http://127.0.0.1:8000/chatbot/summary", "_blank")
            }
            className="bg-green-100 p-4 rounded-3xl flex items-center justify-between shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400"
          >
            <div className="text-left flex-1 ml-8">
              <h4 className="text-xl font-semibold">Report Summary</h4>
            </div>
            <img src={c1} alt="Practice DOST" className="w-56 h-56 mx-4" />
          </button>
        </div>

        {/* Chat Button */}
        <div>
          <button
            onClick={() =>
              window.open("http://127.0.0.1:8000/chatbot/upload", "_blank")
            }
            className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11s1.343 3 3-3 3-1.343 3-3zm-4 8h8a4 4 0 004-4V8a4 4 0 00-4-4H8a4 4 0 00-4 4v7a4 4 0 004 4z"
              />
            </svg>
          </button>
          {isChatOpen && <Chatbot />}
        </div>

        <div>
          <button
            className="fixed bottom-4 left-4 bg-red-700 text-white p-3 rounded-full shadow-lg hover:bg-yellow-600 transition-colors duration-300 z-10"
            onClick={() => callEmergency()}
          >
            <BsBell className="h-10 w-10" />
          </button>
        </div>

        {isChatOpen && <Chatbot />}
        <MoodScoreGraph />
      </div>
    </div>
  );
}

export default Dashboard;
