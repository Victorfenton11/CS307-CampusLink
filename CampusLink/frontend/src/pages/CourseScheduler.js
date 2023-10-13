// import Logo from "../components/Logo";
// import SearchBar from '../components/SearchBar'
// import '../styles/LandingPage.css';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import CourseList from '../components/CourseList';
import ClassList from '../components/ClassList';
// import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/CourseScheduler.css';

const CourseScheduler = () => {
  const [courses, setCourses] = useState([]);
  const [classList, setClassList] = useState([]);
  const [courseNumbers, setCourseNumbers] = useState({});   // Map course ID to course numbers

  useEffect(() => {
    // Fetch course data from Purdue API
    axios.get('https://api.purdue.io/odata/Subjects?$orderby=Abbreviation asc')
      .then(response => {
        setCourses(response.data.value);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleAddClass = (course) => {
    // Check if course is already in class list
    const existingClass = classList.find(c => c.Id === course.Id);
    if (existingClass) {
      alert('This course is already in your class list.');
      return;
    }

    // Add course to class list
    setClassList([...classList, { ...course }]);
  };

  const handleDeleteClass = (course) => {
    // Remove course from class list
    setClassList(classList.filter(c => c.Id !== course.Id));
    // Remove course number from dictionary
    setCourseNumbers({ ...courseNumbers, [course.Id]: undefined });
  };

  const filteredCourses = courses.filter(course => {
    // Filter courses by abbreviation, number, and title
    const courseInfo = course.Abbreviation + course.Number + course.Title;
    return courseInfo.toLowerCase().includes(courseInfo.toLowerCase());
  });

  return (
    <div className="container">
    <header>
      <h1>Course Scheduler</h1>
      <nav>
        <Link to="/">Back to Landing Page</Link>
      </nav>
    </header>
    <main className="main-container">
      <CourseList courses={courses} onAddClass={handleAddClass} />
      <ClassList classes={classList} onDeleteClass={handleDeleteClass} />
    </main>
  </div>
  );
};

export default CourseScheduler;