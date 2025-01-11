import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import { createViewWeek, createViewDay, createViewMonthGrid } from "@schedule-x/calendar";
import '@schedule-x/theme-default/dist/calendar.css';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios'; 
import PopUp from "../components/PopUp";
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'

function Calendar() {
  const [events, setEvents] = useState([]);  
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));  // Format date on initialization

  const [pop, setPop] = useState(false);

  useEffect(() => {
    fetchCalendarData();  // Fetch events when component loads or user id changes
  }, []);

  const fetchCalendarData = async () => {
    try {
      const response = await axios.get(`http://localhost:3500/api/calendar`);  
      
      // Log the response to make sure you're getting the correct data structure
      console.log('Fetched events:', response.data.events);

      const fetchedEvents = response.data.events.map(event => ({
        id: event._id.toString(),  // Make sure to use the correct unique identifier
        title: event.title || 'Untitled Event',  // Default title in case it is missing
        start: formatDate(new Date(event.start)),  // Format start date
        end: formatDate(new Date(event.end)),  // Format end date
      }));

      // Now set the events state to the fetched and formatted events
      setEvents(fetchedEvents);

      // Log to confirm events have been correctly set
      console.log('Formatted events:', fetchedEvents);
      calendar.events.set(fetchedEvents);  

      console.log('Events added to calendar:', fetchedEvents);


      // Set the selected date if it's returned from the server, otherwise use the current date
      const fetchedDate = new Date(response.data.selectedDate);
      if (!isNaN(fetchedDate.getTime())) {
        setSelectedDate(formatDate(fetchedDate));  // Set formatted selected date
      } else {
        console.error('Invalid date format:', response.data.selectedDate);
        setSelectedDate(formatDate(new Date()));  // Fallback to current date with correct format
      }
      calendar.selectedDate.set(selectedDate)
    } catch (error) {
      console.error('Error fetching calendar data:', error);  
    }
  };

  // Now, pass the fetched events to the calendar component
  const calendar = useCalendarApp({
    views: [
      createViewWeek(),
      createViewDay(),
      createViewMonthGrid()
    ],
    events: events,  // Use the fetched events here
    selectedDate: selectedDate,  // Ensure selectedDate is formatted correctly
    plugins: [
      createEventModalPlugin(),
      createDragAndDropPlugin(),
    ]
  });
  console.log(calendar)
  return (
    <>
      <div className="w-full p-8 flex items-center gap-10">
        <ScheduleXCalendar calendarApp={calendar} className="w-full h-full"/>
        <button onClick={() => setPop(true)} className="mr-5 p-2 bg-purple-400 rounded-md ">
          Add Event
        </button>
      </div>

      {pop && <PopUp handleClose={() => { setPop(false); fetchCalendarData(); }} />}
    </>
  );
}

// Helper function to format date into 'YYYY-MM-DD HH:mm'
// Helper function to format date into 'YYYY-MM-DD hh:mm' in 12-hour format
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');  // Ensure 2-digit month
  const day = String(date.getDate()).padStart(2, '0');         // Ensure 2-digit day
  let hours = date.getHours();   // Get hours in 24-hour format
  const minutes = String(date.getMinutes()).padStart(2, '0');  // Ensure 2-digit minutes

  // Convert 24-hour format to 12-hour format
  hours = hours % 12 || 12;  // Convert 0 (midnight) to 12, and 13-23 to 1-11

  // Return formatted date as 'YYYY-MM-DD hh:mm' (12-hour format without AM/PM)
  return `${year}-${month}-${day} ${String(hours).padStart(2, '0')}:${minutes}`;
}

export default Calendar;
