import React, { useState } from 'react';
import { Calendar as BigCalendar, CalendarProps, momentLocalizer} from 'react-big-calendar';
import { Link } from 'react-router-dom';
import moment from "moment";
import './styles/Calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useScrollTrigger } from '@material-ui/core';
import Modal from '../components/Modal'

const localizer = momentLocalizer(moment);

export default function Calendar(props) {
    const [showModal, setShowModal] = useState(false);

    const handleAddClick = () => {
        setShowModal(!showModal);
    };

    const addEvent = () => {
        return;
    }

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

  return (
    <div className='calendar-page'>
        <BigCalendar localizer={localizer} events={myEventsList} startAccessor="start" endAccessor="end" style={{ height: "90%" }} />
        <div className='button-container'>
            <Link to='/profile'><button className='calendar-button'>Back to Profile</button></Link>
            <button className='calendar-button' onClick={handleAddClick}>Add Event</button>
        </div>
        <Modal show={showModal} handleClose={handleAddClick}>
            <h4 className='title'>New Event</h4>
            <input id="newEventName" className="inputBox" type="text" placeholder='Title'></input>
            <input id="newEventDescription" className="inputBox" type="text" placeholder='Location'></input>
            <button className='create-button' onClick={addEvent}>Create Event</button>
        </Modal>
    </div>
  )
}
