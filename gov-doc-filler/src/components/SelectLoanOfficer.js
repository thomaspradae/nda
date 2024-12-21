// src/components/SelectLoanOfficer.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

const SelectLoanOfficer = () => {
  const [loanOfficers, setLoanOfficers] = useState([]);
  const [selectedLoanOfficerId, setSelectedLoanOfficerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoanOfficers = async () => {
      try {
        const token = getToken();
        const response = await axios.get('http://localhost:5000/api/fillers/loan-officers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoanOfficers(response.data.loanOfficers);
      } catch (error) {
        console.error('Error fetching loan officers:', error);
        alert(error.response?.data?.message || 'An error occurred');
      }
    };
    fetchLoanOfficers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      await axios.post(
        'http://localhost:5000/api/fillers/select-loan-officer',
        { loanOfficerId: selectedLoanOfficerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/app-form'); // Proceed to the form
    } catch (error) {
      console.error('Error selecting loan officer:', error);
      alert(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="select-loan-officer-container">
      <h2>Select Your Loan Officer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Loan Officer:</label>
          <select
            onChange={(e) => setSelectedLoanOfficerId(e.target.value)}
            required
          >
            <option value="">-- Select Loan Officer --</option>
            {loanOfficers.map((officer) => (
              <option key={officer.id} value={officer.id}>
                {officer.name}
              </option>
            ))}
            <option value={null}>Not displayed or have no loan officer</option>
          </select>
        </div>
        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default SelectLoanOfficer;
