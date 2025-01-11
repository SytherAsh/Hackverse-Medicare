import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const JoinRoomPage = () => {
    const [roomCode, setRoomCode] = useState("");
    const navigate = useNavigate();
    const handleFormSubmit = (e)=>{
        e.preventDefault();
        navigate(`/room/${roomCode}`);
    }
    return (
        <div className='h-screen flex items-center justify-center rounded-xl p-4'>
            <div className='bg-gradient-to-r from-[#3793FF] to-[#0017E4] justify-center items-center rounded-2xl p-4 shadow-2xl border-b-4 border-b-blue-700 overflow-hidden'>
                <form onSubmit={handleFormSubmit} className='rounded-xl'>
                    <div className='flex flex-col gap-8 p-8'>
                        <label className='text-5xl text-center font-[Inter] text-white'>Enter Room Code</label>
                        <div className='flex gap-8 justify-center items-center'>
                            <input 
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                                type="text" 
                                required placeholder='Enter Room Code' 
                                className='border-gray-600 text-2xl rounded-xl p-2'
                            />
                            <button type='submit' className='bg-gradient-to-r from-[#FFF500] to-[#FFB800] rounded-xl p-2 text-2xl border-b-yellow-500 border-b-2 shadow-2xl'>Enter Room</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default JoinRoomPage