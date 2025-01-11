import { useContext, useState } from 'react'
import {Routes , Route} from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import axios from 'axios'
import Dashboard from './pages/Dashboard'
import JoinRoomPage from './pages/JoinRoomPage'
import JoinCallPage from './pages/JoinCallPage' 
import MapComponent from './pages/Map'
import Booking from './pages/Booking'
import Calendar from './pages/Calender'
import { UserContext } from './UserContext'
import DashBoard2 from './pages/Dashboard2'
import JournalMain from './pages/JournalMain'
import CalmingThoughts from './components/CalmingThoughts'
import Event from './pages/Event'
import EventsPage from './pages/EventPage'
import CreateEvent from './pages/CreateEvent'
import Wellness from './components/Wellness'

function App() {
  const {user} = useContext(UserContext)
  axios.defaults.withCredentials = true
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/dashboard' element={user?.role === 1984 ? <Dashboard /> : <DashBoard2 />} />
      <Route path="/joinroom" element={<JoinRoomPage/>}/>
      <Route path="/room/:roomId" element={<JoinCallPage/>}/>
      <Route path='/map' element={<MapComponent />} />
      <Route path='/booking' element={<Booking />} />
      <Route path='/calendar' element={<Calendar />} />
      <Route path='/journal' element={<JournalMain />} />
      <Route path='/pixel' element={<CalmingThoughts />} />
      <Route path='/event' element={<Event />} />
      <Route path='/event/events' element={<EventsPage/>}/>
      <Route path='/create' element={<CreateEvent/>}/>
      <Route path='/wellness' element={<Wellness />} />
    </Routes>
  )
}

export default App
