import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Kuis from './pages/Kuis';
import './main.css';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Kuis" element={<Kuis />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
