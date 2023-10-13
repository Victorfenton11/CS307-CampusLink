import React from 'react';

const SubjectClasses = ({ classes, onAddClass }) => {
  return (
    <div>
      <h2>Subject Classes</h2>
      <ul>
        {classes.map(course => (
          <li key={course.Id}>
            {course.Title} - {course.Number}
            <button className='save-btn' onClick={() => onAddClass(course)}>Add Class</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubjectClasses;