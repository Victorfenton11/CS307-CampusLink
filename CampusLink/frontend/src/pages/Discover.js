import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import SubjectList from '../components/SubjectList';
import ClassList from '../components/ClassList';
import './styles/CourseScheduler.css';
import SubjectClasses from '../components/SubjectClasses';
import swal from 'sweetalert'

const Discover = () => {
  const [subjectList, setSubjects] = useState([]);
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);   // Subject selected from dropdown
  const [subjectClasses, setSubjectClasses] = useState([]);   // Classes for selected subject
  const [classList, setClassList] = useState([]);
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    axios.get('https://api.purdue.io/odata/Subjects?$orderby=Abbreviation asc')
      .then(response => {
        setSubjects(response.data.value);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleAddSubject = (subject) => {
    axios.get(`https://api.purdue.io/odata/Courses?$filter=SubjectId eq ${subject.Id}&$orderby=Number asc`)
      .then(response => {
        setSubjectClasses(response.data.value);
      })
      .catch(error => {
        console.log(error);
      });
    setCourseData({...courseData, name:subjectClasses.Number})
    setSelectedSubject({ ...subject });
  };

  const handleAddClass = (course) => {
    // Check if course is already in class list
    const existingClass = classList.find(c => c.Id === course.Id);
    if (existingClass) {
      alert('This course is already in your class list.');
      return;
    }
    console.log(typeof course);
    // setCourseData({ ...courseData, name: course.Number});
    // setCourseData({ ...courseData, abbreviation: course.Title });
    setClassList([...classList, { ...course }]);
  };

  const handleDeleteClass = (course) => {
    // Remove course from class list
    setClassList(classList.filter(c => c.Id !== course.Id));
  };

  const handleSave = () => {
    console.log(classList);
    axios.post('/api/save-class-list/', { classList })    // Save class list to database
      .then(response => {
        console.log('Class list saved successfully!');
        swal({
          title: "Congrats!",
          text: "Class list saved successfully!",
          icon: "success",
          button: "Aww yiss!",
        });
        //alert('Class list saved successfully!');
      })
      .catch(error => {
        console.log(error);
        //alert('Error saving class list.');
      });
    navigate('/profile');
  };

  const filteredSubject = subjectList.filter(course => {
    // Filter courses by abbreviation, number, and title
    const courseInfo = course.Abbreviation + course.Number + course.Title;
    return courseInfo.toLowerCase().includes(courseInfo.toLowerCase());
  });

  return (
    <div className="discover-style">
      <header>
        <h1>Course Scheduler</h1>
        <button className='save-btn' onClick={handleSave}>Save</button>
      </header>
      <main className="main-container">
        <SubjectList subjects={subjectList} onAddSubject={handleAddSubject} />
        {selectedSubject && (
          <SubjectClasses classes={subjectClasses} onAddClass={handleAddClass} />
        )}
        {classList.length > 0 && (
          <ClassList classes={classList} onDeleteClass={handleDeleteClass} />
        )}
      </main>
    </div>
  );
};

export default Discover;