import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './pages/LandingPage'
import DeletingPage from './pages/DeletingPage';

const appDiv = ReactDOM.createRoot(document.getElementById('app'));
appDiv.render(
  <React.StrictMode>
    <BrowserRouter>
      <DeletingPage />
    </BrowserRouter>
  </React.StrictMode>
);