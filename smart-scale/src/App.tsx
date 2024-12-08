import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import ScalePage from './pages/ScalePage.tsx';
import SecurityScale from './pages/SecurityScale.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scale" element={<ScalePage />} />
        <Route path="/securityscale" element={<SecurityScale />} />
      </Routes>
    </Router>
  );
}

export default App;