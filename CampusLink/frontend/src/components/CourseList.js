import React from 'react';
import '../styles/CourseList.css';

const CourseList = ({ courses, onAddClass }) => {
  return (
    <div className="course-list">
      {courses.map(course => (
        <div className="course-item" key={course.Id}>
          <h3>{course.Abbreviation}</h3>
          <p>{course.Name}</p>
          <button onClick={() => onAddClass(course)}>Add Class</button>
        </div>
      ))}
    </div>
  );
};

export default CourseList;