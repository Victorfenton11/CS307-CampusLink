// page on course scheduler
import Footer from "../components/Footer";
import Logo from "../components/Logo";
// import SearchBar from '../components/SearchBar'
import '../styles/LandingPage.css';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import CourseList from '../components/CourseList';
// import ClassList from '../components/ClassList';

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
    // Add course to class list
    setClassList([...classList, course]);
  };

  const handleDeleteClass = (course) => {
    // Remove course from class list
    setClassList(classList.filter(c => c !== course));
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
      <Logo />
      {/* <SearchBar onSearch={handleSearch} /> */}
      {/* <CourseList courses={filteredCourses} onAddClass={handleAddClass} />
      <ClassList classList={classList} onDeleteClass={handleDeleteClass} /> */}
      <Footer />
    </div>
  );
};

export default CourseScheduler;