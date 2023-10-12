// page on course scheduler
import Footer from "../components/Footer";
import Logo from "../components/Logo";
// import SearchBar from '../components/SearchBar'
import '../styles/LandingPage.css';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CourseList from '../components/CourseList';
import ClassList from '../components/ClassList';

const CourseScheduler = () => {
  const [courses, setCourses] = useState([]);
  const [classList, setClassList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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
    // Generate new course number
    const courseNumber = courseNumbers[course.Id] ? courseNumbers[course.Id] + 1 : 1;
    // Add course to class list
    setClassList([...classList, { ...course, Number: courseNumber }]);
    // Update course number dictionary
    setCourseNumbers({ ...courseNumbers, [course.Id]: courseNumber });
  };

  const handleDeleteClass = (course) => {
    // Remove course from class list
    setClassList(classList.filter(c => c.Id !== course.Id));
    // Remove course number from dictionary
    setCourseNumbers({ ...courseNumbers, [course.Id]: undefined });
  };

  const handleSearch = (term) => {
    // Update search term
    setSearchTerm(term);
  };

  const filteredCourses = courses.filter(course => {
    // Filter courses by search term
    return course.Subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
           course.Number.toLowerCase().includes(searchTerm.toLowerCase()) ||
           course.Title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1>Course Scheduler</h1>
      <Link to="/">Back to Landing Page</Link>
      <CourseList courses={courses} onAddClass={handleAddClass} />
      <ClassList classes={classList} onDeleteClass={handleDeleteClass} />
    </div>
  );
};

export default CourseScheduler;