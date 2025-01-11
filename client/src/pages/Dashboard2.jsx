import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SideBarComp from '../components/SideBarComp';
import { ThemeContext } from '../THemeContext';
import QuizPopup from '../components/Quiz';
import c1 from '../assets/c1.svg';
import c2 from '../assets/c2.svg';
import bg from '../assets/big.jpg';
import { UserContext } from '../UserContext';
import axios from 'axios';



function DashBoard2() {
    const { theme } = useContext(ThemeContext);
    const [greeting, setGreeting] = useState('');
    const { user, ready } = useContext(UserContext);
    const [thought, setThought] = useState('');
    const [plan , setPlan] = useState('');
    
    // console.log(user);

    const tableData = [
        { name: "John Doe", date: "2024-11-01", payment: "$120", disease: "Hypertension", feedback: "Positive" },
        { name: "Jane Smith", date: "2024-11-03", payment: "$150", disease: "Diabetes", feedback: "Good" },
        { name: "Michael Brown", date: "2024-11-05", payment: "$100", disease: "Asthma", feedback: "Satisfactory" },
        { name: "Emma Wilson", date: "2024-11-07", payment: "$130", disease: "Arthritis", feedback: "Excellent" },
        { name: "Oliver Davis", date: "2024-11-09", payment: "$110", disease: "Cardiac Issues", feedback: "Positive" }
    ];

    useEffect(() => {
        const fetchThought = async () => {
          const res = await axios.get('http://localhost:3500/api/affirmations');
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

    if (!ready) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found. Please log in again.</div>;
    }

    return (
        <div className="flex">
            <SideBarComp />
            <div className={`p-4 w-full overflow-hidden mt-[76px] ${theme === 'light' ? '' : 'bg-black text-white'}`}>
                {/* Upper Section */}
                <div
                    className={`rounded-2xl p-6 h-52 mb-6 flex flex-col items-center md:flex-row justify-center bg-cover bg-center relative`}
                    style={{ backgroundImage: `url(${bg})` }}
                >
                    <div className="text-center md:text-left md:flex-1 ml-8">
                        <h2 className="text-black text-3xl font-bold mb-2">{greeting}, {user.name}</h2>
                        <p className="text-black text-md mb-4">{thought}</p>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-auto rounded-lg shadow-lg">
                    <table className="min-w-full bg-white dark:bg-gray-800">
                        <thead>
                            <tr>
                                <th className="text-left p-4 border-b dark:border-gray-700 bg-gray-200 dark:bg-gray-700">Patient Name</th>
                                <th className="text-left p-4 border-b dark:border-gray-700 bg-gray-200 dark:bg-gray-700">Date</th>
                                <th className="text-left p-4 border-b dark:border-gray-700 bg-gray-200 dark:bg-gray-700">Payment</th>
                                <th className="text-left p-4 border-b dark:border-gray-700 bg-gray-200 dark:bg-gray-700">Disease</th>
                                <th className="text-left p-4 border-b dark:border-gray-700 bg-gray-200 dark:bg-gray-700">Feedback</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((patient, index) => (
                                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <td className="p-4 border-b dark:border-gray-700">{patient.name}</td>
                                    <td className="p-4 border-b dark:border-gray-700">{patient.date}</td>
                                    <td className="p-4 border-b dark:border-gray-700">{patient.payment}</td>
                                    <td className="p-4 border-b dark:border-gray-700">{patient.disease}</td>
                                    <td className="p-4 border-b dark:border-gray-700">{patient.feedback}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DashBoard2;
