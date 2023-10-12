import React from 'react';
import { Link } from 'react-router-dom';

const MyButton = () => {
  return (
    <Link to="/course-scheduler">
      <button>Go to Course Scheduler</button>
    </Link>
  );
};

export default MyButton;