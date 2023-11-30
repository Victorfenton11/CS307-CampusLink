import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, CalendarProps, momentLocalizer} from 'react-big-calendar';
import { Link } from 'react-router-dom';
import moment from "moment";
import './styles/Calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from '../components/Modal'

const localizer = momentLocalizer(moment);

export default function Calendar(props) {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [eventData, setEventData] = useState(null);

    const handleAddClick = () => {
        setShowModal(!showModal);
    };

    const addEvent = () => {
        return;
    }
    const fetchUserData = async (userID) => {
        try {
          // Make API request
          const response = await fetch('/api/getEvents');
          
          // Check if the request was successful
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
    
          // Parse JSON response
          const data = await response.json();
          console.log(data);
          // Set user data in state
          setEventData(data);
          // Set loading state to false
        } catch (error) {
          console.error('Error saving user data:', error.message);
        }
      };
    const myEventsList = [
        {
            start:moment('2023-11-27T13:00:00').toDate(),
            end:moment('2023-11-27T14:00:00').toDate(),
            title:"Example Event",
        },
        {
            start:moment('2023-11-27T13:00:00').toDate(),
            end:moment('2023-11-27T14:00:00').toDate(),
            title:"Example Event",
        },
        {
            start:moment('2023-11-27T13:00:00').toDate(),
            end:moment('2023-11-27T14:00:00').toDate(),
            title:"Example Event",
        }
    ]
    useEffect(() => {
        fetchUserData();
        console.log("Execute");
    }, []);
  console.log(eventData);
  if (eventData) {
    return (
        <div className='calendar-page'>
            <BigCalendar localizer={localizer} events={eventData} startAccessor="start" endAccessor="end" style={{ height: "90%" }} />
            <div className='button-container'>
                <Link to='/profile'><button className='calendar-button'>Back to Profile</button></Link>
                <button className='calendar-button' onClick={handleAddClick}>Add Event</button>
            </div>
            <Modal show={showModal} handleClose={handleAddClick}>
                <h4>Add Event</h4>
                <input id="newEventName" className="inputBox" type="text" placeholder='New Event Name'></input>
                <input id="newEventDescription" className="inputBox" type="text" placeholder='Description'></input>
                <button className='create-button' onClick={addEvent}>Create Event</button>
            </Modal>
        </div>
      )

  }
  return (
    <div className='calendar-page'>
        <BigCalendar localizer={localizer} events={myEventsList} startAccessor="start" endAccessor="end" style={{ height: "90%" }} />
        <div className='button-container'>
            <Link to='/profile'><button className='calendar-button'>Back to Profile</button></Link>
            <button className='calendar-button' onClick={handleAddClick}>Add Event</button>
        </div>
        <Modal show={showModal} handleClose={handleAddClick}>
            <h4>Add Event</h4>
            <input id="newEventName" className="inputBox" type="text" placeholder='New Event Name'></input>
            <input id="newEventDescription" className="inputBox" type="text" placeholder='Description'></input>
            <button className='create-button' onClick={addEvent}>Create Event</button>
        </Modal>
    </div>
  )
}