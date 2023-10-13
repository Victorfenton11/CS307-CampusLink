import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './components/LandingPage'
import DeletingPage from './components/DeletingPage';
import CourseScheduler from './pages/CourseScheduler';

const appDiv = ReactDOM.createRoot(document.getElementById('app'));
appDiv.render(
  <React.StrictMode>
    <BrowserRouter>
      <CourseScheduler/>
    </BrowserRouter>
  </React.StrictMode>
);