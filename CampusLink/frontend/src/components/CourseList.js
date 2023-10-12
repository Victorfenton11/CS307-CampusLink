import React from 'react';

const CourseList = ({ courses, onAddClass }) => {
  return (
    <div>
      <h2>Course List</h2>
      <ul>
        {courses.map(course => (
          <li key={course.Id}>
            {course.Abbreviation} - {course.Name}
            <button onClick={() => onAddClass(course)}>Add Class</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;