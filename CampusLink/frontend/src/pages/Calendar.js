import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, CalendarProps, momentLocalizer} from 'react-big-calendar';
import { Link } from 'react-router-dom';
import moment from "moment";
import './styles/Calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useScrollTrigger } from '@material-ui/core';
import Modal from '../components/Modal'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ColorPicker from '../components/ColorPicker';
import Switch from "react-switch";

const localizer = momentLocalizer(moment);

export default function Calendar(props) {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [eventData, setEventData] = useState([]);
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [description, setDescription] = useState(null);
    const [color, setColor] = useState("#265985");
    const [checked, setChecked] = useState(false);

    const handleAddClick = () => {
        setShowModal(!showModal);
    };

    const addEvent = () => {
        setEventData(eventData.concat([{
            start:start.toDate(),
            end:end.toDate(),
            title:title,
            color: color,
        }]));
        setShowModal(false);

        return;
    }

    const setBackgroundColor = (e) => {
      return {
        style: {backgroundColor: e.color}
      }
    }

    const handleChange = (checked) => {
        setChecked(checked);
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

      useEffect(() => {
            fetchUserData();
        }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className='calendar-page'>
            <BigCalendar localizer={localizer} events={eventData} startAccessor="start" endAccessor="end" style={{ height: "90%" }} defaultView='week' eventPropGetter={setBackgroundColor}/>
            <div className='button-container'>
                <Link to='/profile'><button className='calendar-button'>Back to Profile</button></Link>
                <button className='calendar-button' onClick={handleAddClick}>Add Event</button>
            </div>
            <Modal show={showModal} handleClose={handleAddClick}>
                <h4 className='title'>New Event</h4>
                <input id="newEventName" className="inputBox" type="text" placeholder='Title' onChange={(e) => setTitle(e.target.value)}></input>
                <input id="newEventDescription" className="inputBox" type="text" placeholder='Location' onChange={(e) => setLocation(e.target.value)}></input>
                <DateTimePicker label="Starts" className='datetime-picker' value={start} onChange={(e) => setStart(e)}/>
                <DateTimePicker label="Ends" className='datetime-picker' value={end} onChange={(e) => setEnd(e)}/>
                <input id="newEventDescription" className="inputBox" type="text" placeholder='Description' onChange={(e) => setDescription(e.target.value)}></input>
                <ColorPicker setEventColor={setColor}></ColorPicker>
                <label className='add-users'>Hidden<Switch className='switch-button' onChange={handleChange} checked={checked} uncheckedIcon={false} checkedIcon={false}/>Visible</label>
                <button className='create-button' onClick={addEvent}>Create Event</button>
            </Modal>
        </div>
    </LocalizationProvider>
  )
}
