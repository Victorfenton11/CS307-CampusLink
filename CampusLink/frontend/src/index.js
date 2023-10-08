import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './components/LandingPage'
import DeletingPage from './components/DeletingPage';

const appDiv = ReactDOM.createRoot(document.getElementById('app'));
appDiv.render(
  <React.StrictMode>
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>
  </React.StrictMode>
);