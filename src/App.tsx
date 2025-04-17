import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import Dashboard from './pages/Dashboard';
import BM01 from './pages/BM01';
import '@coreui/coreui/dist/css/coreui.min.css';
import './App.css';
import BM02 from './pages/BM02';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bm01" element={<BM01 />} />
          <Route path="bm02" element={<BM02 />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
