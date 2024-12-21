// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoanOfficerLogin from './components/LoanOfficerLogin';
import LoanOfficerRegister from './components/LoanOfficerRegister';
import FillerLogin from './components/FillerLogin';
import FillerRegister from './components/FillerRegister';
import SelectLoanOfficer from './components/SelectLoanOfficer';
import AppForm from './components/AppForm';
import LoanOfficerDashboard from './components/LoanOfficerDashboard'; // Import the dashboard
import FillerForm from './components/FillerForm';
import LoanOfficerForm from './components/LoanOfficerForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppForm />} />
        {/* Loan Officer Routes */}
        <Route path="/loan-officer/login" element={<LoanOfficerLogin />} />
        <Route path="/loan-officer/register" element={<LoanOfficerRegister />} />
        <Route path="/loan-officer/dashboard" element={<LoanOfficerDashboard />} /> {/* Add this line */}
        {/* Filler Routes */}
        <Route path="/filler/login" element={<FillerLogin />} />
        <Route path="/filler/register" element={<FillerRegister />} />
        <Route path="/select-loan-officer" element={<SelectLoanOfficer />} />
        <Route path="/filler-form" element={<FillerForm />} />
        <Route path="/loan-officer-form" element={<LoanOfficerForm />} />
        <Route path="/app-form" element={<AppForm />} />
      </Routes>
    </Router>
  );
}

export default App;
