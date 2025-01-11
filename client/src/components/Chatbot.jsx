import axios from 'axios';
import React, { useState , useEffect } from 'react';
import { MdSend } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
  }, []);



 
  async function handleSubmit() {
    if (input.trim() === '') return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post('http://10.240.13.126:8000/api/chat/', { 
        question: input,
        session_id: sessionId,
      } 
    );
      const botResponse = response.data.response;
      setMessages([...newMessages, { role: 'assistant', content: botResponse }]);

    } catch (error) {
      console.error('Error fetching chatbot response:', error);
    }
  }
  return (
    <div className="fixed bottom-24 right-6 w-80 h-96 bg-white shadow-xl rounded-xl p-4 z-50">
      <h2 className="text-xl text-yellow-600 font-bold mb-4 text-center">Chat with us</h2>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`bg-gradient-to-r ${msg.role === 'user' ? 'from-cyan-300 to-blue-400 text-black' : 'from-gray-400 to-gray-700 text-white'} p-2 rounded-xl w-auto max-w-xs`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <div className="flex mb-10">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border border-gray-300 rounded-lg p-2" placeholder="Type a message..." />
          <button onClick={handleSubmit} className="bg-orange-400 text-white p-3 rounded-lg ml-2"><MdSend size={16}/></button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;