import React from 'react';

const ClassList = ({ classes, onDeleteClass }) => {
  return (
    <div>
      <h2>Class List</h2>
      <ul>
        {classes.map(course => (
          <li key={course.Id}>
            {course.Abbreviation} - {course.Name}
            <button onClick={() => onDeleteClass(course)}>Delete Class</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassList;