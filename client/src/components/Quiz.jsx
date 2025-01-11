import React, { useState, useEffect } from 'react';
import { IoIosCloseCircle } from "react-icons/io";
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie to access cookies


const QuizPopup = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false); 
  const [selectedAnswers, setSelectedAnswers] = useState([]); 
  const [currQuestion, setCurrQuestion] = useState(0); 
  const [questions, setQuestions] = useState([]); 
  const [showConfirmation, setShowConfirmation] = useState(false); 
  const [quizTakenToday, setQuizTakenToday] = useState(false);
  const [db , setDb] = useState([]);

  useEffect(() => {
    const lastAttemptDate = localStorage.getItem('quizLastAttempt');
    const today = new Date().toISOString().split('T')[0];

    if (lastAttemptDate === today) {
      setQuizTakenToday(true);
    } else {
      setShowConfirmation(true);
    }
  }, []);

  useEffect(() => {
    if (isQuizOpen) {
      fetchQuestions();
    }
  }, [isQuizOpen]);

  async function fetchQuestions() {
    try {
      const res = await axios.get('http://localhost:3500/api/question');
      if (res.data) {
        setQuestions(res.data);
      }
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  }

  async function callDjango() {
    // Prepare each question-answer pair as JSON with the format { text: "question:answer" }
    const questionAnswerPairs = questions.map((question, index) => {
      return { text: `${question.question}: ${question.options[selectedAnswers[index]]}` };
    });
  
    try {
      const res = await axios.post(
        'http://10.240.13.126:8000/api/mood_score/',
        questionAnswerPairs // Send the array directly
      );
      if (res.data) {
        setDb(res.data.mood_score);
        callNode();
      }
    } catch (error) {
      console.error("Error calling Django backend", error);
    }
  }
  
  

  async function callNode(){
    const res = await axios.post('http://localhost:3500/api/moodlogs' , {db});
    if(res.daat){
      console.log(res.data);
    }
  }

  const handleStartQuiz = () => {
    setShowConfirmation(false);
    setIsQuizOpen(true);
  };

  const closeQuiz = async () => {
    const answers = questions.map((ques, index) => ({
      question_id: ques.id,
      option_index: selectedAnswers[index],
    }));

    try {
      const res = await axios.post('http://localhost:3500/api/answer', { answers });
      if (res.status === 200) {
        resetQuiz();
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('quizLastAttempt', today);
        setQuizTakenToday(true);
        alert('You have attempted Quiz for today');
        await callDjango(); // Call Django backend after submitting answers
      }
    } catch (error) {
      console.error("Error submitting answers", error);
    }
  };

  const resetQuiz = () => {
    setIsQuizOpen(false);
    setSelectedAnswers([]);
    setCurrQuestion(0);
  };

  const handleAnswerChange = (index) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currQuestion] = index; // Store index of selected option
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currQuestion < questions.length - 1) {
      setCurrQuestion(currQuestion + 1);
    } else {
      alert("You've reached the end of the quiz!");
      closeQuiz();
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {!quizTakenToday && showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-11/12 md:w-1/3 p-6 shadow-lg relative">
            <h1 className='text-xl text-gray-700 font-semibold mb-4'>Do you want to take the quiz now?</h1>
            <div className='flex justify-center gap-4'>
              <button 
                type="button" 
                onClick={handleStartQuiz}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                Yes
              </button>
              <button 
                type="button" 
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {isQuizOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-11/12 md:w-1/3 p-6 shadow-lg relative">
            <button
              onClick={() => resetQuiz()}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              <IoIosCloseCircle />
            </button>
            <form>
              <h2 className="text-xl font-semibold mb-4">{questions[currQuestion]?.question}</h2>
              {questions[currQuestion]?.options?.map((option, index) => (
                <label key={index} className="block mb-2">
                  <input
                    type="radio"
                    name="answer"
                    value={index}
                    checked={selectedAnswers[currQuestion] === index}
                    onChange={() => handleAnswerChange(index)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
              {currQuestion < questions.length - 1 ? (
                <button 
                  type="button" 
                  onClick={handleNext}
                  className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                >
                  Next Question
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={closeQuiz}
                  className="mt-4 w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                >
                  Submit
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPopup;
