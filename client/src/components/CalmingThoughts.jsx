import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { SparklesCore } from './ui/sparkles';

const CalmingThoughts = () => {
  const [thought, setThought] = useState('');
  const [startAnimation, setStartAnimation] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const controls = useAnimation();

  const handleStart = () => {
    setStartAnimation(true);
    startThoughtAnimation();
    playBackgroundAudio();
  };

  const handleStartAgain = () =>{
    setShowCompletionMessage(false);
    setStartAnimation(false);
  }

  const startThoughtAnimation = async () => {
    await controls.start({
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5 }
    });

    await controls.start({
      scale: 0.1,
      opacity: 0,
      transition: { duration: 15 }
    });

    setShowCompletionMessage(true);
  };

  const playBackgroundAudio = () => {
    const audio = new Audio('/background.mp3');
    audio.loop = true;
    audio.play();
    return () => audio.pause();
  };

  return (
    <div className="calming-container">
      <SparklesCore
          background="transparent"
          minSize={0.5}
          maxSize={1}
          particleDensity={100}
          className="w-full h-full absolute"
          particleColor="#FFFFFF"
        />
      {!startAnimation ? (
        <div className="input-section flex flex-col gap-4">
          <div className='flex flex-col items-center gap-4'>
            <h2 className='text-4xl'>What's on your mind?</h2>
            <div className='rounded-full h-64 w-64 bg-yellow-400 border-black drop-shadow-lg'>
              
            </div>
            <input
              type="text"
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="Type your thought here..."
              className="text-black text-2xl rounded-xl w-96 h-10 border-gray-600"
            />
          </div>
          <button className="text-3xl" onClick={handleStart}>
            Let it go
          </button>
        </div>
      ) : (
        <div className="thought-animation">
          <motion.p
            initial={{ scale: 1, opacity: 1 }}
            animate={controls}
          >
            <div className="thought-circle text-black"></div>
            <p className='z-20'>{thought}</p>
          </motion.p>
        </div>
      )}
      {showCompletionMessage && !thought && (
        <div className="completion-message">
          <p>Your thought is released. Breathe and feel lighter.</p>
          <button onClick={handleStartAgain}>
            Start again <MdExpandMore />
          </button>
        </div>
      )}
    </div>
  );
};

export default CalmingThoughts;