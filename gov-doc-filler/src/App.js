import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoanOfficerLogin from './components/LoanOfficerLogin';
import LoanOfficerRegister from './components/LoanOfficerRegister';
import FillerLogin from './components/FillerLogin';
import FillerRegister from './components/FillerRegister';
import SelectLoanOfficer from './components/SelectLoanOfficer';
import AppForm from './components/AppForm';
import LoanOfficerDashboard from './components/LoanOfficerDashboard'; // Import the dashboard
import FillerForm from './components/FillerForm';
import LoanOfficerForm from './components/LoanOfficerForm';
import FillerDashboard from './components/FillerDashboard';
import SubmissionDetails from './components/SubmissionDetails';

function HomePage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the App</h1>
      <a href="/log-in" style={{ fontSize: '20px', color: 'blue', textDecoration: 'underline' }}>
        Go to Log In
      </a>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/log-in" element={<FillerLogin />} />
        <Route path="/loan-officer/login" element={<LoanOfficerLogin />} />
        <Route path="/loan-officer/register" element={<LoanOfficerRegister />} />
        <Route path="/loan-officer/dashboard" element={<LoanOfficerDashboard />} />
        <Route path="/filler/login" element={<FillerLogin />} />
        <Route path="/register" element={<FillerRegister />} />
        <Route path="/select-loan-officer" element={<SelectLoanOfficer />} />
        <Route path="/filler-form" element={<FillerForm />} />
        <Route path="/loan-officer-form" element={<LoanOfficerForm />} />
        <Route path="/dashboard" element={<FillerDashboard />} />
        <Route path="/submissions/:id" element={<SubmissionDetails />} />
        <Route path="/app-form" element={<AppForm />} />
      </Routes>
    </Router>
  );
}

export default App;
