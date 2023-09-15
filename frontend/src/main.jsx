import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import Navbar from './navbar';
import Meme from './Meme';
import ImageEdit from './ImageEdit';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import the updated components

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <React.StrictMode>
      <Navbar />
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/" element={<App />} />
        <Route path="/meme" element={<Meme />} /> {/* Use element to define the component */}
        <Route path="/imageEdit" element={<ImageEdit/>} />
        <Route path="/*" element={<Navigate to="/" />} /> {/* Fallback route */}
      </Routes>
    </React.StrictMode>
  </Router>,
);
