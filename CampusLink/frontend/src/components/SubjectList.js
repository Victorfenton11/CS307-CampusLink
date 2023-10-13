import React from 'react';
import './styles/SubjectList.css';

const SubjectList = ({ subjects, onAddSubject }) => {
  return (
    <div className="subject-list">
      {subjects.map(subject => (
        <div className="subject-item" key={subject.Id}>
          <h3>{subject.Abbreviation}</h3>
          <p>{subject.Name}</p>
          <button onClick={() => onAddSubject(subject)}>Add Subject</button>
        </div>
      ))}
    </div>
  );
};

export default SubjectList;