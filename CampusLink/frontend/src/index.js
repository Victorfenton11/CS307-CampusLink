import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import FriendPage from './pages/FriendPage'

const appDiv = ReactDOM.createRoot(document.getElementById('app'));
appDiv.render(
  <React.StrictMode>
      <BrowserRouter>
        <FriendPage/>
      </BrowserRouter>
  </React.StrictMode>
);