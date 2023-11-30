import React from 'react';
import { Calendar as BigCalendar, CalendarProps, momentLocalizer} from 'react-big-calendar';
import moment from "moment";
import './styles/Calendar.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function Calendar(props) {

    const myEventsList = [
        {
            start:moment('2023-11-27T13:00:00').toDate(),
            end:moment('2023-11-27T14:00:00').toDate(),
            title:"Example Event",
        }
    ]

  return (
    <div className='calendar-page'>
        <BigCalendar localizer={localizer} events={myEventsList} startAccessor="start" endAccessor="end" style={{ height: "90%" }} />
    </div>
  )
}
