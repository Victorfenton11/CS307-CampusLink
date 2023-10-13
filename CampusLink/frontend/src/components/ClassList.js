import React from 'react';

const ClassList = ({ classes, onDeleteClass }) => {
  return (
    <div>
      <h2>Your Classes</h2>
      <ul>
        {classes.map(course => (
          <li key={course.Id}>
            {course.Title} - {course.Number}
            <button className='save-btn' onClick={() => onDeleteClass(course)}>Delete Class</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassList;